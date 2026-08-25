<script setup lang="ts">
import loginCompanions from '@/assets/login-companions.svg'
</script>

<template>
  <aside class="login-support">
    <img class="login-support-image" :src="loginCompanions" alt="" width="640" height="420" />
    <h2>Cuide do catálogo da ONG em um só lugar</h2>
    <p>
      Depois de entrar, a equipe atualiza animais disponíveis, marca adoções e mantém as informações
      visíveis para quem busca um pet.
    </p>
  </aside>
</template>

<style scoped>
@reference "@/styles/main.css";

.login-support {
  @apply flex flex-col gap-4;
}

.login-support-image {
  @apply w-full rounded-box border border-base-300 object-cover shadow-sm;
}

.login-support h2 {
  @apply font-serif text-3xl font-bold tracking-tight;
}
</style>
