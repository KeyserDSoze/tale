# Prompt: Traduzione automatica capitoli Astro

## Architettura e flusso

Hai una struttura di cartelle per i racconti in `src/content/stories/{name}/{language}/{chaptername}_chap_{chapterNumber}.md`.
- La storia originale è scritta in italiano (`it`).
- Le lingue di destinazione sono: inglese (`en`), tedesco (`de`), francese (`fr`), spagnolo (`es`), giapponese (`ja`), cinese (`zh`).
- Ogni capitolo è un file Markdown con un frontmatter Astro all'inizio.

## Cosa deve fare l'agent

1. **Itera tutti i file nella cartella italiana**
   - Per ogni file in `src/content/stories/{name}/it/` con pattern `{chaptername}_chap_{chapterNumber}.md`.
2. **Per ogni lingua di destinazione**
   - Se il file esiste già in `src/content/stories/{name}/{lang}/`, sovrascrivi.
   - Altrimenti crea il file.
3. **Traduci solo le seguenti chiavi del frontmatter**
   - `title`
   - `description`
   - `maintitle` (se presente)
   - `maindescription` (se presente)
   - Tutto il contenuto markdown dopo il frontmatter.
4. **Non tradurre**
   - `date`, `lang`, `id`, `taleid`, `chapter`, `type`, `genre`, `author` (mantieni invariati).
5. **Per ogni iterazione**
   - Lavora su un solo file e una sola lingua per volta.
   - Non processare più file o lingue nella stessa iterazione.
6. **Output**
   - Il file tradotto deve avere lo stesso frontmatter, con le chiavi tradotte dove richiesto, e il contenuto markdown tradotto.
   - Il file va salvato in `src/content/stories/{name}/{lang}/{chaptername}_chap_{chapterNumber}.md`.

## Esempio di frontmatter da tradurre
```markdown
---
title: "La bambina e il cammino"
description: "In un villaggio lontano, una bambina dal cuore pieno di sogni viene strappata al suo cammino. Le sue lacrime diventano un richiamo che la foresta non può ignorare."
date: "2025-08-29"
lang: "it"
id: "leone_chap_001"
taleid: "leone"
chapter: 1
type: story
genre: fantasy,children
maintitle: "Il coraggio di Leone"
maindescription: "In una foresta lontana, la paura di un leone diventa la sua più grande forza. Una fiaba che racconta come il coraggio nasce dal dubbio, dall’amicizia e dalla scelta di non arrendersi mai."
author: "Alessandro Rapiti"
---
```

## Esempio di traduzione (italiano → inglese)
```markdown
---
title: "The Girl and the Path"
description: "In a distant village, a girl with a heart full of dreams is torn from her path. Her tears become a call that the forest cannot ignore."
date: "2025-08-29"
lang: "en"
id: "leone_chap_001"
taleid: "leone"
chapter: 1
type: story
genre: fantasy,children
maintitle: "Leone's Courage"
maindescription: "In a distant forest, a lion's fear becomes his greatest strength. A tale about how courage is born from doubt, friendship, and the choice to never give up."
author: "Alessandro Rapiti"
---
```

## Istruzioni per l'agent
- Itera file per file, lingua per lingua.
- Traduci solo le chiavi richieste e il contenuto markdown.
- Sovrascrivi i file se già esistono.
- Mantieni la struttura e il pattern dei file.
- Non processare più di un file o lingua per volta.
- Usa la traduzione più naturale e letteraria possibile.

---
Questo prompt serve per automatizzare la traduzione dei capitoli Astro in tutte le lingue del progetto, mantenendo la coerenza e la struttura dei file.
