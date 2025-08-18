// Utility to handle base path for different deployment environments

/**
 * Get the base path for the current environment
 * Returns '/tale' for GitHub Pages, '' for custom domains (tale.mobi, tales.ws, tale.mobi, tales.mobi)
 */
export function getBasePath(): string {
  // Check if we're in the browser or server
  if (typeof window !== 'undefined') {
    // Browser environment - check the current hostname
    const hostname = window.location.hostname;
    // If we're on any of the custom domains, don't use base path
    const customDomains = ['tale.mobi', 'www.tale.mobi', 'tales.ws', 'www.tales.ws', 'tale.mobi', 'www.tale.mobi', 'tales.mobi', 'www.tales.mobi'];
    if (customDomains.includes(hostname)) {
      return '';
    }
    // If we're on GitHub Pages, use base path
    if (hostname.includes('github.io')) {
      return '/tale';
    }
    // Default to no base path for custom domains
    return '';
  } else {
    // Server environment - check environment variables
    // Force custom domain build
    if (process.env.DEPLOY_TARGET === 'custom') {
      return '';
    }
    // Force GitHub Pages build
    if (process.env.DEPLOY_TARGET === 'github') {
      return '/tale';
    }
    // Legacy logic
    const isGitHubPages = process.env.GITHUB_PAGES === 'true' || (process.env.CI && !process.env.CUSTOM_DOMAIN);
    return isGitHubPages ? '/tale' : '';
  }
}

/**
 * Create a URL with the appropriate base path
 * @param path - The path to append (should start with /)
 * @returns The full path with base if needed
 */
export function createUrl(path: string): string {
  const basePath = getBasePath();
  // Ensure path starts with /
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${basePath}${cleanPath}`;
}

/**
 * Create asset URL with base path
 * @param assetPath - Path to the asset
 * @returns Full asset URL
 */
export function createAssetUrl(assetPath: string): string {
  const basePath = getBasePath();
  const cleanPath = assetPath.startsWith('/') ? assetPath : `/${assetPath}`;
  return `${basePath}${cleanPath}`;
}

/**
 * Create language-specific URL
 * @param lang - Language code
 * @param path - Optional path (defaults to empty)
 * @returns Language URL with base path
 */
export function createLangUrl(lang: string, path: string = ''): string {
  const basePath = getBasePath();
  const cleanPath = path.startsWith('/') ? path : (path ? `/${path}` : '');
  return `${basePath}/${lang}${cleanPath}`;
}
