/** @type {import('tailwindcss').Config} */
module.exports = {
  // Specify files to scan for CSS classes
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',  // Pages directory
    './components/**/*.{js,ts,jsx,tsx,mdx}',  // Components directory
    './app/**/*.{js,ts,jsx,tsx,mdx}',  // App directory (Next.js 13+)
  ],
  darkMode: 'class',
  theme: {
    extend: {
      // Custom color palette for the application
      colors: {
        border: 'hsl(var(--border))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        error: {
          DEFAULT: 'hsl(var(--error))',
          foreground: 'hsl(var(--error-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [],  // No additional Tailwind plugins used
} 