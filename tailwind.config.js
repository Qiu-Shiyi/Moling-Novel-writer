/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          900: '#0a0a0f',
          800: '#12121a',
          700: '#1a1a24',
          600: '#252532',
          500: '#353545',
        },
        cinnabar: {
          DEFAULT: '#c45c48',
          light: '#d47360',
          glow: 'rgba(196, 92, 72, 0.15)',
        },
        bamboo: '#5a8a6e',
        rattan: '#c9a84c',
        paper: {
          DEFAULT: '#e8e0d0',
          dim: '#a09888',
        },
      },
      fontFamily: {
        serif: ["'Noto Serif SC'", 'serif'],
        sans: ["'Noto Sans SC'", 'sans-serif'],
      },
      boxShadow: {
        'glow-cinnabar': '0 0 20px rgba(196, 92, 72, 0.15)',
        'level-1': '0 1px 2px rgba(0,0,0,0.3)',
        'level-2': '0 4px 12px rgba(0,0,0,0.4)',
        'level-3': '0 8px 24px rgba(0,0,0,0.5)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'ripple': 'ripple 0.6s ease-out',
        'shimmer': 'shimmer 2s infinite',
        'pulse-glow': 'pulse-glow 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(8px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        ripple: {
          '0%': { transform: 'scale(0)', opacity: '0.5' },
          '100%': { transform: 'scale(4)', opacity: '0' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 5px rgba(196, 92, 72, 0.15)' },
          '50%': { boxShadow: '0 0 20px rgba(196, 92, 72, 0.15)' },
        },
      },
    },
  },
  plugins: [],
}
