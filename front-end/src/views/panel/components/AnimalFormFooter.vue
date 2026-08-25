<script setup lang="ts">
import AppIcon from '@/shared/components/AppIcon.vue'

withDefaults(
  defineProps<{
    isFirstStep: boolean
    isLastStep: boolean
    canContinue: boolean
    submitLabel: string
    isSubmitting?: boolean
  }>(),
  {
    isSubmitting: false,
  },
)

const emit = defineEmits<{
  back: []
  next: []
}>()
</script>

<template>
  <footer class="form-footer">
    <button type="button" class="btn" :disabled="isFirstStep || isSubmitting" @click="emit('back')">
      <AppIcon name="chevron-left" />
      Voltar
    </button>
    <button
      type="button"
      class="btn btn-primary"
      :disabled="!canContinue || isSubmitting"
      @click="emit('next')"
    >
      {{ isLastStep ? submitLabel : 'Continuar' }}
      <AppIcon name="chevron-right" />
    </button>
  </footer>
</template>

<style scoped>
@reference "@/styles/main.css";

.form-footer {
  @apply mt-8 flex items-center justify-between gap-4 border-t border-base-300 pt-5;
}
</style>
