// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import { defineConfig } from 'astro/config';

// Configurazione per "Narrarium" - Racconti su narrarium.com
const forceGitHubPages = process.env.DEPLOY_TARGET === 'github';
const forceCustomDomain = process.env.DEPLOY_TARGET === 'custom';
const useGitHubConfig = forceGitHubPages || (process.env.CI && !process.env.CUSTOM_DOMAIN && !forceCustomDomain);

// Dominio principale: narrarium.com
const siteUrl = forceCustomDomain ? 'https://narrarium.com' : (useGitHubConfig ? 'https://keyserdsoze.github.io' : 'https://narrarium.com');
const baseUrl = (useGitHubConfig && !forceCustomDomain) ? '/narrarium' : '';

// https://astro.build/config
export default defineConfig({
	site: siteUrl,
	base: baseUrl,
	integrations: [mdx(), sitemap(), tailwind()],
	build: {
		assets: '_astro'
	}
});
