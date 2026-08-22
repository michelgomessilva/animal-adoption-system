<script setup lang="ts">
interface Props {
  title?: string
  description?: string
}

withDefaults(defineProps<Props>(), {
  title: 'Cuide do catálogo da ONG em um só lugar',
  description:
    'Depois de entrar, a equipe atualiza animais disponíveis, marca adoções e mantém as informações visíveis para quem busca um pet.',
})
</script>

<template>
  <aside class="login-support">
    <img
      class="login-support-image"
      src="https://picsum.photos/640/420"
      alt="Cão e gato descansando juntos"
      width="640"
      height="420"
    />
    <h2>{{ title }}</h2>
    <p>{{ description }}</p>
  </aside>
</template>

<style scoped>
@reference "@/styles/main.css";

.login-support {
  @apply flex flex-col gap-4;
}

.login-support-image {
  @apply w-full rounded-box object-cover;
}

.login-support h2 {
  @apply text-2xl font-bold;
}
</style>
