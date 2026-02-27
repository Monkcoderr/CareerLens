/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#EAF2FF',
          100: '#DBEAFE',
          500: '#2563EB',
          900: '#1E3A8A',
        },
        surface: {
          DEFAULT: '#F8FAFC',
          alt: '#F1F5F9',
          card: '#FFFFFF',
          dark: '#0F172A',
        },
        txt: {
          primary: '#0F172A',
          muted: '#64748B',
        },
        border: {
          DEFAULT: '#E2E8F0',
        },
        success: '#16A34A',
        warning: '#F97316',
      },
      borderRadius: {
        'lg': '12px',
        'xl': '20px',
        '2xl': '24px',
      },
      boxShadow: {
        'soft': '0 8px 30px rgba(0,0,0,0.06)',
        'heavy': '0 20px 40px rgba(0,0,0,0.08)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};