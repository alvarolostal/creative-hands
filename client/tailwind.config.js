/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#CB6843',
          50: '#F9EDE8',
          100: '#F3DCD3',
          200: '#E9BCA9',
          300: '#DF9C7F',
          400: '#D57C55',
          500: '#CB6843',
          600: '#A85336',
          700: '#7D3E28',
          800: '#53291B',
          900: '#29150D',
        },
        dark: {
          DEFAULT: '#262624',
          50: '#4A4A46',
          100: '#3F3F3D',
          200: '#343432',
          300: '#2E2E2C',
          400: '#262624',
          500: '#1E1E1C',
          600: '#161614',
          700: '#0E0E0D',
          800: '#060605',
          900: '#000000',
        },
        light: {
          DEFAULT: '#F5F5F4',
          50: '#FFFFFF',
          100: '#FEFEFE',
          200: '#FCFCFB',
          300: '#F9F9F8',
          400: '#F7F7F6',
          500: '#F5F5F4',
          600: '#E8E8E6',
          700: '#DBDBD8',
          800: '#CECECA',
          900: '#C1C1BC',
        }
      },
      fontFamily: {
        // Poppins como primera opción para la tipografía moderna del cuerpo
        sans: ['Poppins', '-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-down': 'slideDown 0.4s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}