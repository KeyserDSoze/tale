import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const stories = defineCollection({
	// Load Markdown and MDX files in the `src/content/` directory directly
	loader: glob({ base: './src/content', pattern: '**/*.{md,mdx}' }),
	// Type-check frontmatter using a schema
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			date: z.coerce.date().optional(),
			// Legacy support for pubDate
			pubDate: z.coerce.date().optional(),
			updatedDate: z.coerce.date().optional(),
			heroImage: image().optional(),
			lang: z.enum(['it', 'en', 'es', 'fr', 'de', 'zh', 'ja']).default('en'),
			// Custom ID for consistent routing across languages
			id: z.string().optional(),
			// Author information
			author: z.string().optional().default('Tale'),
			// Series/Multi-chapter story support
			taleid: z.string().optional(), // ID for grouping chapters
			chapter: z.number().optional(), // Chapter number
			maintitle: z.string().optional(), // Main title for the series
			maindescription: z.string().optional(), // Main description for the series
		}).refine((data) => data.date || data.pubDate, {
			message: "Either 'date' or 'pubDate' must be provided",
		}).transform((data) => ({
			...data,
			// Use date if provided, otherwise use pubDate for backward compatibility
			date: data.date || data.pubDate!,
		})),
});

export const collections = { stories };
