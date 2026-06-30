import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          black: '#111111',
          orange: '#C85A17',
          'orange-light': '#E06820',
          'orange-dark': '#A04410',
          green: '#1FA34A',
          red: '#D72638',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        premium: '0 4px 24px rgba(0,0,0,0.10)',
        card: '0 2px 8px rgba(0,0,0,0.06)',
        soft: '0 1px 4px rgba(0,0,0,0.08)',
      },
      animation: {
        'fade-in': 'fadeIn 0.25s ease',
        'slide-up': 'slideUp 0.25s ease',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { transform: 'translateY(12px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
      },
    },
  },
  plugins: [],
}
export default config
