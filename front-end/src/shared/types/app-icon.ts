export const APP_ICON_NAMES = [
  'chevron-left',
  'chevron-right',
  'eye',
  'eye-off',
  'inbox',
  'landmark',
  'log-out',
  'menu',
  'paw-print',
  'plus',
] as const

export type AppIconName = (typeof APP_ICON_NAMES)[number]

export type AppIconSize = 'xs' | 'sm' | 'md' | 'lg'
