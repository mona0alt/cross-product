import type { Config } from 'tailwindcss';

const config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        admin: {
          bg: '#f5f3ef',
          surface: '#ffffff',
          elevated: '#f0eeea',
          border: 'rgba(0,0,0,0.06)',
          'border-strong': 'rgba(0,0,0,0.12)',
          accent: '#c87941',
          'accent-hover': '#b56a36',
          success: '#2e7d32',
          warning: '#bfa030',
          danger: '#c0392b',
          'text-primary': '#1e1e1e',
          'text-secondary': '#5c5c5c',
          'text-muted': '#9ca3af'
        }
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body: ['"DM Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace']
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.5s ease-out forwards',
        'fade-in': 'fadeIn 0.4s ease-out forwards'
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        }
      }
    }
  },
  plugins: []
} satisfies Config;

export default config;
