<template>
  <div class="page-container">
    <slot />
  </div>
</template>

<style scoped>
@reference "@/styles/main.css";

.page-container {
  @apply mx-auto w-full max-w-6xl px-4 py-8;
}
</style>
