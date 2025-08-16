// Client-side URL utilities for browser environment
export function createLangUrl(lang, path = '') {
	const baseUrl = window.location.origin;
	const isGitHubPages = window.location.hostname.includes('github.io');
	
	if (isGitHubPages) {
		return `${baseUrl}/tale/${lang}${path}`;
	} else {
		return `${baseUrl}/${lang}${path}`;
	}
}

export function detectBrowserLanguage() {
	const supportedLanguages = ['it', 'en', 'es', 'fr', 'de', 'zh', 'ja'];
	const defaultLanguage = 'en';
	
	// Get browser languages
	const browserLanguages = navigator.languages || [navigator.language || navigator.userLanguage];
	
	// Check each browser language against supported languages
	for (const browserLang of browserLanguages) {
		// Get the primary language code (e.g., 'en' from 'en-US')
		const langCode = browserLang.split('-')[0].toLowerCase();
		
		if (supportedLanguages.includes(langCode)) {
			return langCode;
		}
	}
	
	// If no supported language found, return default
	return defaultLanguage;
}
