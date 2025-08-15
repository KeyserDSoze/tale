/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Atkinson', 'sans-serif'],
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: 'rgb(55 65 81)',
            h1: {
              color: 'rgb(17 24 39)',
            },
            h2: {
              color: 'rgb(17 24 39)',
            },
            h3: {
              color: 'rgb(17 24 39)',
            },
            h4: {
              color: 'rgb(17 24 39)',
            },
            strong: {
              color: 'rgb(17 24 39)',
            },
            blockquote: {
              color: 'rgb(75 85 99)',
              borderLeftColor: 'rgb(209 213 219)',
            },
            code: {
              color: 'rgb(17 24 39)',
              backgroundColor: 'rgb(243 244 246)',
              padding: '0.25rem 0.375rem',
              borderRadius: '0.25rem',
              fontWeight: '500',
            },
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
          },
        },
        invert: {
          css: {
            '--tw-prose-body': 'rgb(229 231 235)',
            '--tw-prose-headings': 'rgb(249 250 251)',
            '--tw-prose-lead': 'rgb(156 163 175)',
            '--tw-prose-links': 'rgb(147 197 253)',
            '--tw-prose-bold': 'rgb(249 250 251)',
            '--tw-prose-counters': 'rgb(156 163 175)',
            '--tw-prose-bullets': 'rgb(75 85 99)',
            '--tw-prose-hr': 'rgb(55 65 81)',
            '--tw-prose-quotes': 'rgb(229 231 235)',
            '--tw-prose-quote-borders': 'rgb(55 65 81)',
            '--tw-prose-captions': 'rgb(156 163 175)',
            '--tw-prose-code': 'rgb(249 250 251)',
            '--tw-prose-pre-code': 'rgb(229 231 235)',
            '--tw-prose-pre-bg': 'rgb(31 41 55)',
            '--tw-prose-th-borders': 'rgb(55 65 81)',
            '--tw-prose-td-borders': 'rgb(75 85 99)',
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    function({ addUtilities }) {
      const newUtilities = {
        '.scrollbar-hide': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
          '&::-webkit-scrollbar': {
            display: 'none'
          }
        }
      }
      addUtilities(newUtilities)
    }
  ],
}
