export const APP_ICON_NAMES = [
  'cat',
  'chevron-left',
  'chevron-right',
  'dog',
  'eye',
  'eye-off',
  'inbox',
  'landmark',
  'log-out',
  'menu',
  'paw-print',
  'pencil',
  'plus',
  'refresh-cw',
] as const

export type AppIconName = (typeof APP_ICON_NAMES)[number]

export type AppIconSize = 'xs' | 'sm' | 'md' | 'lg'
