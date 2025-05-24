/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.tsx", "./components/**/*.{js,jsx,ts,tsx}", "./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        'primary': 'var(--color-primary)',
        'secondary': 'var(--color-secondary)',
        'background': 'var(--color-background)',
        'surface': 'var(--color-surface)',
        'surface-variant': 'var(--color-surface-variant)',
        'on-background': 'var(--color-on-background)',
        'on-surface': 'var(--color-on-surface)',
        'on-surface-variant': 'var(--color-on-surface-variant)',
        'border': 'var(--color-border)',
        'tab-active': 'var(--color-tab-active)',
        'tab-inactive': 'var(--color-tab-inactive)',

        'error': 'var(--color-error)',
        'warning': 'var(--color-warning)',
        'success': 'var(--color-success)',
        'info': 'var(--color-info)',
        'on-primary': 'var(--color-on-primary)',
        'on-secondary': 'var(--color-on-secondary)',
        'on-error': 'var(--color-on-error)',
        'disabled': 'var(--color-disabled)',
        'on-disabled': 'var(--color-on-disabled)',
        'outline': 'var(--color-outline)',
        'shadow': 'var(--color-shadow)',
      }
    },
  },
  plugins: [],
}