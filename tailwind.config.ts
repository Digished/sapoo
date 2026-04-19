import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      animation: {
        'bounce-in':  'bounceIn 0.2s ease-out',
        'fade-up':    'fadeUp 0.5s ease-out both',
        'fade-up-1':  'fadeUp 0.5s ease-out 0.08s both',
        'fade-up-2':  'fadeUp 0.5s ease-out 0.16s both',
        'fade-up-3':  'fadeUp 0.5s ease-out 0.24s both',
        'float':      'float 3.5s ease-in-out infinite',
      },
      keyframes: {
        bounceIn: {
          '0%':   { transform: 'scale(0.95)' },
          '60%':  { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)' },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(18px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-7px)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
