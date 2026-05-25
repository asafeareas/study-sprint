/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#0a0a0f',
        surface: '#12121a',
        'surface-elevated': '#1a1a24',
        border: '#2a2a3a',
        primary: {
          DEFAULT: '#7c3aed',
          hover: '#6d28d9',
          muted: 'rgba(124, 58, 237, 0.15)',
        },
        accent: {
          DEFAULT: '#f59e0b',
          hover: '#d97706',
          muted: 'rgba(245, 158, 11, 0.15)',
        },
        streak: {
          DEFAULT: '#10b981',
          muted: 'rgba(16, 185, 129, 0.15)',
        },
        danger: {
          DEFAULT: '#ef4444',
          hover: '#dc2626',
          muted: 'rgba(239, 68, 68, 0.15)',
        },
        muted: '#6b7280',
        foreground: '#f3f4f6',
        'foreground-secondary': '#9ca3af',
      },
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
        display: ['Space Mono', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 20px rgba(124, 58, 237, 0.4), 0 0 40px rgba(124, 58, 237, 0.2)',
        'glow-accent': '0 0 20px rgba(245, 158, 11, 0.4)',
        card: '0 4px 24px rgba(0, 0, 0, 0.4)',
      },
      animation: {
        'pulse-xp': 'pulse-xp 2s ease-in-out infinite',
        float: 'float 3s ease-in-out infinite',
        glow: 'glow 2s ease-in-out infinite alternate',
        'spin-slow': 'spin 1.5s linear infinite',
      },
      keyframes: {
        'pulse-xp': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.05)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 10px rgba(124, 58, 237, 0.3)' },
          '100%': { boxShadow: '0 0 25px rgba(124, 58, 237, 0.6)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(ellipse at center, rgba(124, 58, 237, 0.15) 0%, transparent 70%)',
      },
    },
  },
  plugins: [],
}
