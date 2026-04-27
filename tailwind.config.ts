import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        lora: ['var(--font-lora)', 'Georgia', 'serif'],
        inter: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#e6f5f4',
          100: '#c0e6e4',
          200: '#97d5d2',
          300: '#6dc4c0',
          400: '#4db8b3',
          500: '#26A69A',
          600: '#1f9088',
          700: '#177873',
          800: '#10605d',
          900: '#07413e',
        },
        garden: {
          bg: '#E0F2F1',
          text: '#1A237E',
          heading: '#0D1117',
          muted: '#90A4AE',
          accent: '#26A69A',
        },
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '65ch',
            color: '#1A237E',
            fontFamily: 'var(--font-lora), Georgia, serif',
            lineHeight: '1.8',
            a: {
              color: '#26A69A',
              '&:hover': {
                color: '#177873',
              },
            },
            h1: { color: '#0D1117', fontFamily: 'var(--font-lora), Georgia, serif' },
            h2: { color: '#0D1117', fontFamily: 'var(--font-lora), Georgia, serif' },
            h3: { color: '#0D1117', fontFamily: 'var(--font-lora), Georgia, serif' },
            h4: { color: '#0D1117', fontFamily: 'var(--font-lora), Georgia, serif' },
            strong: { color: '#0D1117' },
            blockquote: { color: '#1A237E', borderLeftColor: '#26A69A' },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
export default config
