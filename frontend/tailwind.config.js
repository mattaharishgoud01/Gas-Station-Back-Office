/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3B82F6', // Blue 500
          light: '#60A5FA',   // Blue 400
          dark: '#2563EB',    // Blue 600
          50: '#EFF6FF',
        },
        background: {
          DEFAULT: '#FAFAFA', // Ultra light gray for premium feel
          paper: '#FFFFFF',
        },
        sidebar: '#0A0A0A', // Deep pure black-gray
        accent: {
          success: '#10B981', // Emerald 500
          danger: '#EF4444',  // Red 500
          warning: '#F59E0B'  // Amber 500
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card': '0px 1px 2px 0px rgba(0, 0, 0, 0.03), 0px 1px 3px 1px rgba(0, 0, 0, 0.02)',
        'card-hover': '0px 4px 6px -1px rgba(0, 0, 0, 0.04), 0px 2px 4px -1px rgba(0, 0, 0, 0.03)',
        'dropdown': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
        'floating': '0 10px 25px -5px rgba(59, 130, 246, 0.4)',
      }
    },
  },
  plugins: [],
}
