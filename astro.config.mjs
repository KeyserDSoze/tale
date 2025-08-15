// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import { defineConfig } from 'astro/config';

// Determine deployment configuration
// Use environment variable to force GitHub Pages mode when deploying to GitHub
const forceGitHubPages = process.env.DEPLOY_TARGET === 'github';
const isLocalBuild = !process.env.CI;

// For GitHub Pages deployment, use base path and github.io domain
// For custom domain deployment, use no base path and custom domain
const useGitHubConfig = forceGitHubPages || (process.env.CI && !process.env.CUSTOM_DOMAIN);

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
