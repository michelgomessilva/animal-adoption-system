<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

interface Props {
  isVertical?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isVertical: false,
})

const menuClass = computed(() => (props.isVertical ? 'menu menu-vertical' : 'menu menu-horizontal'))
</script>

<template>
  <ul :class="menuClass">
    <li>
      <RouterLink :to="{ name: 'home' }">Adotar</RouterLink>
    </li>
    <li>
      <RouterLink :to="{ name: 'ongs' }">ONGs</RouterLink>
    </li>
    <li>
      <RouterLink :to="{ name: 'how-it-works' }">Como funciona</RouterLink>
    </li>
  </ul>
</template>
