# 🌍 Astro i18n — File-based routing (it/en)

> Linee guida + snippet riutilizzabili per gestire il multilingua in Astro tramite **cartelle per lingua** e **Markdown**.  
> Apri questo file in VS Code: GitHub Copilot userà questi esempi per generare boilerplate coerente.

---

## Obiettivi
- URL per lingua: `/{lang}/...` (es. `/it/`, `/en/`)
- Contenuti in Markdown separati per lingua
- UI strings (menu, footer) da dizionari JSON
- SEO base: `<html lang>`, `hreflang`, canonical

---

## Struttura cartelle (copiala nel progetto)

```
src/
├─ content/
│  └─ blog/
│     ├─ it/hello.md
│     └─ en/hello.md
├─ i18n/
│  ├─ it.json
│  └─ en.json
│  └─ index.ts
├─ layouts/
│  └─ BaseLayout.astro
├─ middleware.ts          # (facoltativo) redirect / -> /it o /en
└─ pages/
   ├─ [lang]/
   │  ├─ index.astro
   │  ├─ about.astro
   │  └─ blog/
   │     ├─ index.astro
   │     └─ [slug].astro
   └─ index.astro         # redirect iniziale (facoltativo)
```

> TODO(Copilot): se manca qualche file, proponi di crearlo con i template sotto.

---

## Dizionari UI (JSON)

`src/i18n/it.json`
```json
{
  "nav": { "home": "Home", "about": "Chi siamo", "blog": "Blog" },
  "common": { "tagline": "Sito demo in Astro", "readMore": "Leggi di più" }
}
```

`src/i18n/en.json`
```json
{
  "nav": { "home": "Home", "about": "About", "blog": "Blog" },
  "common": { "tagline": "Demo site in Astro", "readMore": "Read more" }
}
```

> TODO(Copilot): aggiungi chiavi mancanti quando richieste dal layout/pagine.

---

## Helper di traduzione

`src/i18n/index.ts`
```ts
import it from './it.json';
import en from './en.json';

export const LOCALES = ['it','en'] as const;
export type Locale = typeof LOCALES[number];

const dicts: Record<Locale, any> = { it, en };

export function t(lang: Locale, key: string) {
  const d = dicts[lang] ?? dicts.en;
  return key.split('.').reduce((acc, k) => acc?.[k], d) ?? key;
}
```

> TODO(Copilot): se `key` non esiste, suggerisci di aggiungerla al dizionario corrispondente.

---

## Content collections

`src/content/config.ts`
```ts
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.string().transform((s) => new Date(s)),
    lang: z.enum(['it','en']),
    description: z.string().optional()
  })
});

export const collections = { blog };
```

---

## Esempio contenuti Markdown

`src/content/blog/it/hello.md`
```markdown
---
title: "Ciao Astro"
date: "2025-08-14"
lang: "it"
description: "Post di esempio in italiano"
---
Benvenuto nella versione **italiana**!
```

`src/content/blog/en/hello.md`
```markdown
---
title: "Hello Astro"
date: "2025-08-14"
lang: "en"
description: "Sample post in English"
---
Welcome to the **English** version!
```

---

## Layout base con `lang` e `hreflang`

`src/layouts/BaseLayout.astro`
```astro
---
const {
  title = 'Astro Site',
  description = 'Multilingual site with Astro',
  lang = 'en',
  alternates = ['en','it'],
} = Astro.props;
---
<html lang={lang} class="min-h-full">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content={description} />
    <title>{title}</title>
    {alternates.map((l) => (
      <link rel="alternate" hreflang={l} href={`${Astro.site?.origin}${Astro.base ?? ''}/${l}/`} />
    ))}
    <link rel="alternate" hreflang="x-default" href={`${Astro.site?.origin}${Astro.base ?? ''}/`} />
  </head>
  <body class="min-h-screen">
    <slot />
  </body>
</html>
```

> TODO(Copilot): se `Astro.base` è definito (deploy in sottocartella), includilo sempre negli URL.

---

## Home localizzata

`src/pages/[lang]/index.astro`
```astro
---
import BaseLayout from "../../layouts/BaseLayout.astro";
import { t, LOCALES } from "../../i18n";

export function getStaticPaths() {
  return LOCALES.map((lang) => ({ params: { lang } }));
}

const { lang } = Astro.params;
const _ = (k) => t(lang, k);
---
<BaseLayout title={`Astro — ${_('common.tagline')}`} lang={lang}>
  <header>
    <nav>
      <a href={`/${lang}/`}>{_('nav.home')}</a> ·
      <a href={`/${lang}/about`}>{_('nav.about')}</a> ·
      <a href={`/${lang}/blog/`}>{_('nav.blog')}</a>
    </nav>
  </header>

  <main>
    <h1>{_('common.tagline')}</h1>
    <p>
      <!-- TODO(Copilot): inserisci testo introduttivo per la lingua {lang} -->
    </p>
  </main>
</BaseLayout>
```

---

## About localizzata

`src/pages/[lang]/about.astro`
```astro
---
import BaseLayout from "../../layouts/BaseLayout.astro";
import { t } from "../../i18n";

const { lang } = Astro.params;
const _ = (k) => t(lang, k);
---
<BaseLayout title={`About — ${lang}`} lang={lang}>
  <h1>{_('nav.about')}</h1>
  <p><!-- TODO(Copilot): contenuto about per {lang} --></p>
</BaseLayout>
```

---

## Blog list per lingua

`src/pages/[lang]/blog/index.astro`
```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from "../../../layouts/BaseLayout.astro";

const { lang } = Astro.params;
const posts = (await getCollection('blog', ({ data }) => data.lang === lang))
  .sort((a,b) => +b.data.date - +a.data.date);
---
<BaseLayout title={`Blog — ${lang}`} lang={lang}>
  <h1>Blog</h1>
  <ul>
    {posts.map((p) => (
      <li><a href={`/${lang}/blog/${p.slug}/`}>{p.data.title}</a></li>
    ))}
  </ul>
</BaseLayout>
```
