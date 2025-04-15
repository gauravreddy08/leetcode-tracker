import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        gray: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
        },
        blue: {
          400: '#60A5FA',
          500: '#3B82F6',
          900: '#1E3A8A',
        },
        green: {
          300: '#86EFAC',
          400: '#4ADE80',
          900: '#064E3B',
        },
        yellow: {
          300: '#FDE047',
          400: '#FACC15',
          900: '#713F12',
        },
        red: {
          300: '#FCA5A5',
          400: '#F87171',
          900: '#7F1D1D',
        },
      },
    },
  },
  plugins: [],
};

export default config; 