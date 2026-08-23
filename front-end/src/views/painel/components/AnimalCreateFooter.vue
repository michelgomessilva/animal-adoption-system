<script setup lang="ts">
import AppIcon from '@/shared/components/AppIcon.vue'

defineProps<{
  isFirstStep: boolean
  isLastStep: boolean
  canContinue: boolean
}>()

const emit = defineEmits<{
  back: []
  next: []
}>()
</script>

<template>
  <footer class="create-footer">
    <button type="button" class="btn" :disabled="isFirstStep" @click="emit('back')">
      <AppIcon name="chevron-left" />
      Voltar
    </button>
    <button type="button" class="btn btn-primary" :disabled="!canContinue" @click="emit('next')">
      {{ isLastStep ? 'Cadastrar' : 'Continuar' }}
      <AppIcon name="chevron-right" />
    </button>
  </footer>
</template>

<style scoped>
@reference "@/styles/main.css";

.create-footer {
  @apply mt-8 flex items-center justify-between gap-4 border-t border-base-300 pt-5;
}
</style>
