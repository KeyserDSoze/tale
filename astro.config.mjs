// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import { defineConfig } from 'astro/config';

// Configurazione per "Tale" - Racconti su tale.ws
const forceGitHubPages = process.env.DEPLOY_TARGET === 'github';
const useGitHubConfig = forceGitHubPages || (process.env.CI && !process.env.CUSTOM_DOMAIN);

// Dominio principale: tale.ws
const siteUrl = useGitHubConfig ? 'https://keyserdsoze.github.io' : 'https://tale.ws';
const baseUrl = useGitHubConfig ? '/tale' : '';

// https://astro.build/config
export default defineConfig({
	site: siteUrl,
	base: baseUrl,
	integrations: [mdx(), sitemap(), tailwind()],
	build: {
		assets: '_astro'
	}
});
