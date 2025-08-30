<template>
  <div class="container">
    <header class="hero">
      <h1>Personal Blog</h1>
      <p>Welcome! Read the latest posts.</p>
    </header>

    <div class="actions">
      <input v-model="keyword" placeholder="Search posts..." />
      <select v-model="categoryId">
        <option :value="''">All categories</option>
        <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.name }}</option>
      </select>
      <button @click="refetch()">Search</button>
      <NuxtLink to="/login" class="login-link">Admin</NuxtLink>
    </div>

    <section>
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
.container { max-width: 960px; margin: 0 auto; padding: 16px; }
.hero { margin: 16px 0 24px; }
.grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 16px; }
.actions { display: flex; gap: 8px; margin-bottom: 16px; }
input { flex: 1; padding: 8px; }
select { padding: 8px; }
button { padding: 8px 12px; }
.login-link { margin-left: auto; align-self: center; }
</style>
