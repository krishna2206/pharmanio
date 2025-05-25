import type { ColorDefinitions } from "@/types/colors";
import { vars } from "nativewind";

/**
 * Color definitions for light and dark themes.
 * 
 * Light theme hex colors:
 * - primary: #ea5547
 * - secondary: #51d9a0
 * - background: #ffffff
 * - surface: #f8fafc
 * - surface-variant: #f1f5f9
 * - on-background: #0f172a
 * - on-surface: #1e293b
 * - on-surface-variant: #64748b
 * - border: #e2e8f0
 * - tab-active: #ea5547
 * - tab-inactive: #94a3b8
 * - error: #dc2626
 * - warning: #d97706
 * - success: #059669
 * - info: #2563eb
 * - on-primary: #ffffff
 * - on-secondary: #ffffff
 * - on-error: #ffffff
 * - disabled: #94a3b8
 * - on-disabled: #64748b
 * - outline: #cbd5e1
 * - shadow: #000000
 * 
 * Dark theme hex colors:
 * - primary: #faa59e
 * - secondary: #a2eece
 * - background: #0f172a
 * - surface: #1e293b
 * - surface-variant: #334155
 * - on-background: #f8fafc
 * - on-surface: #f1f5f9
 * - on-surface-variant: #cbd5e1
 * - border: #475569
 * - tab-active: #faa59e
 * - tab-inactive: #64748b
 * - error: #ef4444
 * - warning: #f59e0b
 * - success: #10b981
 * - info: #3b82f6
 * - on-primary: #0f172a
 * - on-secondary: #0f172a
 * - on-error: #ffffff
 * - disabled: #64748b
 * - on-disabled: #94a3b8
 * - outline: #64748b
 * - shadow: #000000
 */
export const colorDefinitions: ColorDefinitions = {
  light: {
    "--color-primary": "234 85 71",
    "--color-secondary": "81 217 160",
    "--color-background": "255 255 255",
    "--color-surface": "248 250 252",
    "--color-surface-variant": "241 245 249",
    "--color-on-background": "15 23 42",
    "--color-on-surface": "30 41 59",
    "--color-on-surface-variant": "100 116 139",
    "--color-border": "226 232 240",
    "--color-tab-active": "234 85 71",
    "--color-tab-inactive": "148 163 184",
    "--color-error": "220 38 38",
    "--color-warning": "217 119 6",
    "--color-success": "5 150 105",
    "--color-info": "37 99 235",
    "--color-on-primary": "255 255 255",
    "--color-on-secondary": "255 255 255",
    "--color-on-error": "255 255 255",
    "--color-disabled": "148 163 184",
    "--color-on-disabled": "100 116 139",
    "--color-outline": "203 213 225",
    "--color-shadow": "0 0 0",
  },
  dark: {
    "--color-primary": "250 165 158",
    "--color-secondary": "162 238 206",
    "--color-background": "15 23 42",
    "--color-surface": "30 41 59",
    "--color-surface-variant": "51 65 85",
    "--color-on-background": "248 250 252",
    "--color-on-surface": "241 245 249",
    "--color-on-surface-variant": "203 213 225",
    "--color-border": "71 85 105",
    "--color-tab-active": "250 165 158",
    "--color-tab-inactive": "100 116 139",
    "--color-error": "239 68 68",
    "--color-warning": "245 158 11",
    "--color-success": "16 185 129",
    "--color-info": "59 130 246",
    "--color-on-primary": "15 23 42",
    "--color-on-secondary": "15 23 42",
    "--color-on-error": "255 255 255",
    "--color-disabled": "100 116 139",
    "--color-on-disabled": "148 163 184",
    "--color-outline": "100 116 139",
    "--color-shadow": "0 0 0",
  },
};

export const themes = {
  light: vars(colorDefinitions.light),
  dark: vars(colorDefinitions.dark),
};