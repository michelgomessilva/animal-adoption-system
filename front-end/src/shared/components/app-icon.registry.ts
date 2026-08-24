import type { Component } from 'vue'

import IconCat from '~icons/lucide/cat'
import IconChevronLeft from '~icons/lucide/chevron-left'
import IconChevronRight from '~icons/lucide/chevron-right'
import IconDog from '~icons/lucide/dog'
import IconEye from '~icons/lucide/eye'
import IconEyeOff from '~icons/lucide/eye-off'
import IconInbox from '~icons/lucide/inbox'
import IconLandmark from '~icons/lucide/landmark'
import IconLogOut from '~icons/lucide/log-out'
import IconMenu from '~icons/lucide/menu'
import IconPawPrint from '~icons/lucide/paw-print'
import IconPlus from '~icons/lucide/plus'
import IconRefreshCw from '~icons/lucide/refresh-cw'

import type { AppIconName } from '@/shared/types/app-icon'

export const APP_ICON_REGISTRY = {
  cat: IconCat,
  'chevron-left': IconChevronLeft,
  'chevron-right': IconChevronRight,
  dog: IconDog,
  eye: IconEye,
  'eye-off': IconEyeOff,
  inbox: IconInbox,
  landmark: IconLandmark,
  'log-out': IconLogOut,
  menu: IconMenu,
  'paw-print': IconPawPrint,
  plus: IconPlus,
  'refresh-cw': IconRefreshCw,
} satisfies Record<AppIconName, Component>
