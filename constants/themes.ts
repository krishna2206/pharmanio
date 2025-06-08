import type { ColorDefinitions } from "@/types/colors";
import { vars } from "nativewind";

/**
 * Color definitions for light and dark themes.
 * 
 * Light theme hex colors:
 * - primary: #4de090
 * - secondary: #cb56d0
 * - background: #FFFFFF
 * - surface: #F8FAFC
 * - surface-variant: #F1F5F9
 * - on-background: #0F172A
 * - on-surface: #1E293B
 * - on-surface-variant: #64748B
 * - border: #E2E8F0
 * - tab-active: #4de090
 * - tab-inactive: #94A3B8
 * - error: #DC2626
 * - warning: #D97706
 * - success: #059669
 * - info: #2563EB
 * - on-primary: #FFFFFF
 * - on-secondary: #FFFFFF
 * - on-error: #FFFFFF
 * - disabled: #94A3B8
 * - on-disabled: #64748B
 * - outline: #CBD5E1
 * - shadow: rgba(0, 0, 0, 0.1)
 * 
 * Dark theme hex colors:
 * - primary: #4de090
 * - secondary: #e6a3e9
 * - background: #0F172A
 * - surface: #1E293B
 * - surface-variant: #334155
 * - on-background: #F8FAFC
 * - on-surface: #F1F5F9
 * - on-surface-variant: #CBD5E1
 * - border: #475569
 * - tab-active: #4de090
 * - tab-inactive: #64748B
 * - error: #EF4444
 * - warning: #F59E0B
 * - success: #10B981
 * - info: #3B82F6
 * - on-primary: #0F172A
 * - on-secondary: #0F172A
 * - on-error: #FFFFFF
 * - disabled: #64748B
 * - on-disabled: #94A3B8
 * - outline: #64748B
 * - shadow: rgba(0, 0, 0, 0.4)
 */
export const colorDefinitions: ColorDefinitions = {
  light: {
    "--color-primary": "77 224 144",
    "--color-secondary": "203 86 208",
    "--color-background": "255 255 255",
    "--color-surface": "248 250 252",
    "--color-surface-variant": "241 245 249",
    "--color-on-background": "15 23 42",
    "--color-on-surface": "30 41 59",
    "--color-on-surface-variant": "100 116 139",
    "--color-border": "226 232 240",
    "--color-tab-active": "77 224 144",
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
    "--color-primary": "77 224 144",
    "--color-secondary": "230 163 233",
    "--color-background": "15 23 42",
    "--color-surface": "30 41 59",
    "--color-surface-variant": "51 65 85",
    "--color-on-background": "248 250 252",
    "--color-on-surface": "241 245 249",
    "--color-on-surface-variant": "203 213 225",
    "--color-border": "71 85 105",
    "--color-tab-active": "77 224 144",
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