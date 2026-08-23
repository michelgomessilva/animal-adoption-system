<script setup lang="ts">
import ComingSoon from '@/views/painel/components/ComingSoon.vue'

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
    <button type="button" class="btn" :disabled="isFirstStep" @click="emit('back')">Voltar</button>
    <div class="create-footer-actions">
      <ComingSoon>
        <button type="button" class="btn">Arquivar</button>
      </ComingSoon>
      <button type="button" class="btn btn-primary" :disabled="!canContinue" @click="emit('next')">
        {{ isLastStep ? 'Cadastrar' : 'Continuar' }}
      </button>
    </div>
  </footer>
</template>

<style scoped>
@reference "@/styles/main.css";

.create-footer {
  @apply mt-6 flex items-center justify-between gap-4;
}

.create-footer-actions {
  @apply flex items-center gap-3;
}
</style>
