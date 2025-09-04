<template>
  <div class="container">
    <header class="hero">
      <h1>Discover Stories, Ideas, and Notes</h1>
      <p>Dive into articles across development, design, and personal growth.</p>
    </header>

    <div class="actions" role="search">
      <input v-model="keyword" class="input" placeholder="Search articles, topics, authors..." />
      <select v-model="categoryId" class="select" aria-label="Filter by category">
        <option :value="''">All categories</option>
        <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.name }}</option>
      </select>
      <button class="btn btn--primary" @click="refetch()">Search</button>
    </div>

    <section aria-live="polite">
      <div v-if="loading">Loading...</div>
      <div v-else>
        <div v-if="!posts.length">No posts yet.</div>
        <div class="grid">
          <PostCard v-for="p in posts" :key="p.id" :post="p" />
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { gql } from '@apollo/client/core';
import PostCard from '~/components/PostCard.vue';

const query = gql`
  query Posts($keyword: String, $category_id: ID) {
    posts(keyword: $keyword, category_id: $category_id) {
      id
      title
      content
      image_url
      created_at
      author { id username }
    }
  }
`;
const CATEGORIES = gql`query { categories { id name } }`;

const keyword = ref('');
const posts = ref<any[]>([]);
const loading = ref(false);
const nuxtApp = useNuxtApp();
const categories = ref<any[]>([]);
const categoryId = ref('');

async function fetchPosts() {
  loading.value = true;
  try {
    const variables: any = { keyword: keyword.value };
    if (categoryId.value) variables.category_id = categoryId.value;
    const { data } = await nuxtApp.$apollo.query({ query, variables });
    posts.value = data?.posts ?? [];
  } finally {
    loading.value = false;
  }
}

onMounted(async () => {
  const { data } = await nuxtApp.$apollo.query({ query: CATEGORIES });
  categories.value = data?.categories ?? [];
  await fetchPosts();
});
const refetch = fetchPosts;
</script>

<style scoped>
/* Page-specific minor tweaks can live here if needed */
</style>
