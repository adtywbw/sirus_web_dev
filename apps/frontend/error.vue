<template>
  <div class="error-page">
    <h1>{{ statusCode }}</h1>
    <p>{{ message }}</p>
    <NuxtLink to="/" class="btn btn--primary">Go home</NuxtLink>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ error: { statusCode: number; message?: string } }>();

const statusCode = props.error.statusCode;
const message = props.error.message || (statusCode === 404 ? 'Page not found' : 'Something went wrong');
</script>

<style scoped>
.error-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  gap: 12px;
  text-align: center;
}
.error-page h1 { font-size: 4rem; margin: 0; }
.error-page p { color: var(--muted); margin: 0; }
</style>
