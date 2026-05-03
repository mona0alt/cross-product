import type { Config } from 'tailwindcss';

const config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        admin: {
          bg: '#f7f9fb',
          surface: '#ffffff',
          elevated: '#f8fafc',
          border: '#e2e8f0',
          'border-strong': '#cbd5e1',
          accent: '#059669',
          'accent-hover': '#047857',
          success: '#059669',
          warning: '#f59e0b',
          danger: '#dc2626',
          'text-primary': '#0f172a',
          'text-secondary': '#475569',
          'text-muted': '#64748b'
        }
      },
      fontFamily: {
        display: ['"Inter"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"Inter"', 'sans-serif']
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
