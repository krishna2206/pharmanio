/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.tsx", "./components/**/*.{js,jsx,ts,tsx}", "./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        'primary': 'rgb(var(--color-primary) / <alpha-value>)',
        'secondary': 'rgb(var(--color-secondary) / <alpha-value>)',
        'background': 'rgb(var(--color-background) / <alpha-value>)',
        'surface': 'rgb(var(--color-surface) / <alpha-value>)',
        'surface-variant': 'rgb(var(--color-surface-variant) / <alpha-value>)',
        'on-background': 'rgb(var(--color-on-background) / <alpha-value>)',
        'on-surface': 'rgb(var(--color-on-surface) / <alpha-value>)',
        'on-surface-variant': 'rgb(var(--color-on-surface-variant) / <alpha-value>)',
        'border': 'rgb(var(--color-border) / <alpha-value>)',
        'tab-active': 'rgb(var(--color-tab-active) / <alpha-value>)',
        'tab-inactive': 'rgb(var(--color-tab-inactive) / <alpha-value>)',

        'error': 'rgb(var(--color-error) / <alpha-value>)',
        'warning': 'rgb(var(--color-warning) / <alpha-value>)',
        'success': 'rgb(var(--color-success) / <alpha-value>)',
        'info': 'rgb(var(--color-info) / <alpha-value>)',
        'on-primary': 'rgb(var(--color-on-primary) / <alpha-value>)',
        'on-secondary': 'rgb(var(--color-on-secondary) / <alpha-value>)',
        'on-error': 'rgb(var(--color-on-error) / <alpha-value>)',
        'disabled': 'rgb(var(--color-disabled) / <alpha-value>)',
        'on-disabled': 'rgb(var(--color-on-disabled) / <alpha-value>)',
        'outline': 'rgb(var(--color-outline) / <alpha-value>)',
        'shadow': 'rgb(var(--color-shadow) / <alpha-value>)',
      }
    },
  },
  plugins: [],
}