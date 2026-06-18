/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './app/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#0A0A0F',
        surface: '#111118',
        surfaceHover: '#1A1A24',
        border: '#2A2A36',
        borderLight: '#3A3A48',
        pending: '#4A6FA5',
        processing: '#C8A84B',
        completed: '#3D9A6F',
        failed: '#C25B5B',
        deadLetter: '#8B5CF6',
        textPrimary: '#F5F5F7',
        textSecondary: '#A0A0B0',
        textMuted: '#6B6B7B',
      },
      fontFamily: {
        syne: ['Syne', 'sans-serif'],
        mono: ['Geist Mono', 'Consolas', 'Monaco', 'monospace'],
      },
      animation: {
        'pulse-dot': 'pulse-dot 2s ease-in-out infinite',
        'pulse-badge': 'pulse-badge 2s ease-in-out infinite',
      },
      keyframes: {
        'pulse-dot': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.5 },
        },
        'pulse-badge': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.85 },
        },
      },
    },
  },
  plugins: [],
};
