/** @type {import('tailwindcss').Config} */
module.exports = {
  // Specify files to scan for CSS classes
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',  // Pages directory
    './components/**/*.{js,ts,jsx,tsx,mdx}',  // Components directory
    './app/**/*.{js,ts,jsx,tsx,mdx}',  // App directory (Next.js 13+)
  ],
  theme: {
    extend: {
      // Custom color palette for the application
      colors: {
        primary: '#3B82F6',    // Blue - Primary actions and branding
        secondary: '#10B981',  // Green - Success states and secondary actions
        error: '#EF4444',      // Red - Error states and destructive actions
      },
    },
  },
  plugins: [],  // No additional Tailwind plugins used
} 