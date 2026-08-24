<template>
  <div class="coming-soon" aria-disabled="true" @click.capture.prevent.stop>
    <div class="coming-soon-content">
      <slot />
    </div>
    <p class="coming-soon-label">Em breve</p>
  </div>
</template>

<style scoped>
@reference "@/styles/main.css";

.coming-soon {
  @apply pointer-events-none opacity-50;
}

.coming-soon-label {
  @apply mt-1 text-xs;
}
</style>
