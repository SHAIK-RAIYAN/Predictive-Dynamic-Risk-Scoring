/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Black and white theme with shades of gray
        primary: {
          50: '#f8f9fa',
          100: '#f1f3f4',
          200: '#e8eaed',
          300: '#dadce0',
          400: '#bdc1c6',
          500: '#9aa0a6',
          600: '#80868b',
          700: '#5f6368',
          800: '#3c4043',
          900: '#202124',
          950: '#000000',
        },
        gray: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#eeeeee',
          300: '#e0e0e0',
          400: '#bdbdbd',
          500: '#9e9e9e',
          600: '#757575',
          700: '#616161',
          800: '#424242',
          900: '#212121',
          950: '#000000',
        },
        // Risk level colors in grayscale
        risk: {
          low: '#f5f5f5',
          medium: '#9e9e9e',
          high: '#424242',
          critical: '#000000',
        },
        // Status colors in monochrome
        success: '#e8f5e8',
        warning: '#f5f5f5',
        error: '#424242',
        info: '#e0e0e0',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'elegant': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'elegant-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'inner-elegant': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
      },
      backgroundImage: {
        'gradient-elegant': 'linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%)',
        'gradient-dark': 'linear-gradient(135deg, #000000 0%, #424242 100%)',
      },
    },
  },
  plugins: [],
  // Ensure compatibility with Material-UI
  corePlugins: {
    preflight: false,
  },
}
