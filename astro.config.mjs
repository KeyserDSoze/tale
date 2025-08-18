// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import { defineConfig } from 'astro/config';

// Configurazione per "Tale" - Racconti su tale.mobi, tales.ws, tale.mobi, tales.mobi
const forceGitHubPages = process.env.DEPLOY_TARGET === 'github';
const forceCustomDomain = process.env.DEPLOY_TARGET === 'custom';
const useGitHubConfig = forceGitHubPages || (process.env.CI && !process.env.CUSTOM_DOMAIN && !forceCustomDomain);

// Dominio principale: tale.mobi (altri domini: tales.ws, tale.mobi, tales.mobi)
const siteUrl = forceCustomDomain ? 'https://tale.mobi' : (useGitHubConfig ? 'https://keyserdsoze.github.io' : 'https://tale.mobi');
const baseUrl = (useGitHubConfig && !forceCustomDomain) ? '/tale' : '';

// https://astro.build/config
export default defineConfig({
	site: siteUrl,
	base: baseUrl,
	integrations: [mdx(), sitemap(), tailwind()],
	build: {
		assets: '_astro'
	}
});
