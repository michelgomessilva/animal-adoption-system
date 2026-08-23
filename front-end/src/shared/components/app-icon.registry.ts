import type { Component } from 'vue'

import IconChevronLeft from '~icons/lucide/chevron-left'
import IconChevronRight from '~icons/lucide/chevron-right'
import IconEye from '~icons/lucide/eye'
import IconEyeOff from '~icons/lucide/eye-off'
import IconInbox from '~icons/lucide/inbox'
import IconLandmark from '~icons/lucide/landmark'
import IconLogOut from '~icons/lucide/log-out'
import IconMenu from '~icons/lucide/menu'
import IconPawPrint from '~icons/lucide/paw-print'
import IconPlus from '~icons/lucide/plus'

import type { AppIconName } from '@/shared/types/app-icon'

export const APP_ICON_REGISTRY = {
  'chevron-left': IconChevronLeft,
  'chevron-right': IconChevronRight,
  eye: IconEye,
  'eye-off': IconEyeOff,
  inbox: IconInbox,
  landmark: IconLandmark,
  'log-out': IconLogOut,
  menu: IconMenu,
  'paw-print': IconPawPrint,
  plus: IconPlus,
} satisfies Record<AppIconName, Component>
