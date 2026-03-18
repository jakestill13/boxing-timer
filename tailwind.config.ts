import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}', // Added src directory
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        // High contrast colors for timer states
        'timer-work': {
          DEFAULT: '#dc2626', // Red-600
          dark: '#b91c1c',    // Red-700
          light: '#ef4444',   // Red-500
        },
        'timer-rest': {
          DEFAULT: '#16a34a', // Green-600
          dark: '#15803d',    // Green-700
          light: '#22c55e',   // Green-500
        },
        'timer-idle': {
          DEFAULT: '#4b5563', // Gray-600
          dark: '#374151',    // Gray-700
          light: '#6b7280',   // Gray-500
        },
        'timer-finished': {
          DEFAULT: '#7c3aed', // Violet-600
          dark: '#6d28d9',    // Violet-700
          light: '#8b5cf6',   // Violet-500
        },
      },
      fontSize: {
        'timer-xl': '6rem',    // 96px
        'timer-2xl': '8rem',   // 128px
        'timer-3xl': '10rem',  // 160px
        'timer-4xl': '12rem',  // 192px
      },
    },
  },
  plugins: [],
}
export default config
