/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FECE14',
          foreground: '#000000',
        },
        secondary: {
          DEFAULT: '#000000',
          foreground: '#FECE14',
        },
        surface: '#FFFFFF',
        'surface-dark': '#111827',
        text: '#111827',
        'text-dark': '#F9FAFB',
        muted: '#6B7280',
        'muted-dark': '#9CA3AF',
        border: '#E5E7EB',
        'border-dark': '#374151',
        success: '#16A34A',
        warning: '#D97706',
        danger: '#DC2626',
      },
      fontFamily: {
        sans: ['Poppins', 'system-ui', 'sans-serif'],
        mono: ['IBM Plex Mono', 'monospace'],
      },
      spacing: {
        '4': '4px',
        '8': '8px',
        '12': '12px',
        '16': '16px',
        '24': '24px',
        '32': '32px',
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        'card-hover': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'stagger-1': 'fadeIn 0.3s ease-out 0.1s both',
        'stagger-2': 'fadeIn 0.3s ease-out 0.2s both',
        'stagger-3': 'fadeIn 0.3s ease-out 0.3s both',
        'stagger-4': 'fadeIn 0.3s ease-out 0.4s both',
        'stagger-5': 'fadeIn 0.3s ease-out 0.5s both',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
