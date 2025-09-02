<template>
  <div class="max-w-3xl mx-auto p-4" v-if="post">
    <NuxtLink to="/" class="text-blue-600">← Back</NuxtLink>
    <h1 class="text-3xl font-bold">{{ post.title }}</h1>
    <p class="text-gray-600 mt-2 mb-4">By {{ post.author.username }} — {{ new Date(post.created_at).toLocaleString() }}</p>
    <img
      v-if="post.image_url"
      :src="post.image_url"
      alt="cover"
      class="w-full max-h-96 object-cover rounded-md my-3"
    />
    <article class="leading-relaxed text-gray-900" v-html="contentHtml"></article>
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



