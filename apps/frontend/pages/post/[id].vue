<template>
  <div class="container" v-if="post">
    <NuxtLink to="/">← Back</NuxtLink>
    <h1>{{ post.title }}</h1>
    <p class="meta">By {{ post.author.username }} — {{ new Date(post.created_at).toLocaleString() }}</p>
    <img v-if="post.image_url" :src="post.image_url" alt="cover" />
    <article class="content" v-html="contentHtml"></article>
  </div>
</template>

<script setup lang="ts">
import type { Post } from '~/types';
import { POST } from '~/graphql/queries';
import DOMPurify from 'dompurify';

const route = useRoute();
const nuxtApp = useNuxtApp();
const post = ref<Post | null>(null);

onMounted(async () => {
  const { data } = await nuxtApp.$apollo.query({ query: POST, variables: { id: route.params.id } });
  post.value = data?.post ?? null;
});

const contentHtml = computed(() => {
  if (!post.value?.content) return '';
  const html = post.value.content.replace(/\n/g, '<br/>');
  return DOMPurify.sanitize(html);
});
</script>

<style scoped>
.container { max-width: 720px; margin: 0 auto; padding: 16px; }
.meta { color: #6b7280; margin: 8px 0 16px; }
img { width: 100%; max-height: 360px; object-fit: cover; border-radius: 6px; margin: 12px 0; }
.content { line-height: 1.7; color: #111827; }
</style>

