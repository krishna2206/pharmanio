interface ColorDefinition {
  "--color-primary": string;
  "--color-secondary": string;
  "--color-background": string;
  "--color-surface": string;
  "--color-surface-variant": string;
  "--color-on-background": string;
  "--color-on-surface": string;
  "--color-on-surface-variant": string;
  "--color-border": string;
  "--color-tab-active": string;
  "--color-tab-inactive": string;
  "--color-error": string;
  "--color-warning": string;
  "--color-success": string;
  "--color-info": string;
  "--color-on-primary": string;
  "--color-on-secondary": string;
  "--color-on-error": string;
  "--color-disabled": string;
  "--color-on-disabled": string;
  "--color-outline": string;
  "--color-shadow": string;
  [key: `--${string}`]: string;
}

export interface ColorDefinitions {
  light: ColorDefinition;
  dark: ColorDefinition;
}

export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  surfaceVariant: string;
  onBackground: string;
  onSurface: string;
  onSurfaceVariant: string;
  border: string;
  tabActive: string;
  tabInactive: string;
  error: string;
  warning: string;
  success: string;
  info: string;
  onPrimary: string;
  onSecondary: string;
  onError: string;
  disabled: string;
  onDisabled: string;
  outline: string;
  shadow: string;
}