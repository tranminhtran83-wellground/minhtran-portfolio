import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
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
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '65ch',
            color: '#334155',
            a: {
              color: '#26A69A',
              '&:hover': {
                color: '#177873',
              },
            },
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
