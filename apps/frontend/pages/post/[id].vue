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
import { gql } from '@apollo/client/core';

const route = useRoute();
const nuxtApp = useNuxtApp();
const post = ref<any | null>(null);

const query = gql`
  query Post($id: ID!) {
    post(id: $id) {
      id
      title
      content
      image_url
      created_at
      author { id username }
    }
  }
`;

onMounted(async () => {
  const { data } = await nuxtApp.$apollo.query({ query, variables: { id: route.params.id } });
  post.value = data?.post ?? null;
});

const contentHtml = computed(() => post.value?.content?.replace(/\n/g, '<br/>') ?? '');
</script>

<style scoped>
.container { max-width: 720px; margin: 0 auto; padding: 16px; }
.meta { color: #6b7280; margin: 8px 0 16px; }
img { width: 100%; max-height: 360px; object-fit: cover; border-radius: 6px; margin: 12px 0; }
.content { line-height: 1.7; color: #111827; }
</style>

