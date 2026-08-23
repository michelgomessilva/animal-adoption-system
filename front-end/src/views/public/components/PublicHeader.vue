<script setup lang="ts">
import AppIcon from '@/shared/components/AppIcon.vue'
import BrandLogo from '@/shared/components/BrandLogo.vue'

import PublicHeaderActions from './PublicHeaderActions.vue'
import PublicNav from './PublicNav.vue'
</script>

<template>
  <header class="navbar bg-base-200">
    <div class="navbar-start">
      <details class="dropdown lg:hidden">
        <summary class="btn btn-ghost btn-square" aria-label="Abrir menu">
          <AppIcon name="menu" />
        </summary>
        <div class="dropdown-content z-10 mt-2 w-56 bg-base-100 shadow-sm">
          <PublicNav is-vertical />
        </div>
      </details>
      <BrandLogo />
    </div>
    <nav class="navbar-center hidden lg:flex" aria-label="Principal">
      <PublicNav />
    </nav>
    <div class="navbar-end">
      <PublicHeaderActions />
    </div>
  </header>
</template>
