<template>
  <div class="max-w-4xl mx-auto p-4">
    <header class="mt-4 mb-6">
      <h1 class="text-2xl font-bold">Personal Blog</h1>
      <p>Welcome! Read the latest posts.</p>
    </header>

    <div class="flex gap-2 mb-4">
      <input v-model="keyword" placeholder="Search posts..." class="flex-1 p-2 border rounded" />
      <select v-model="categoryId" class="p-2 border rounded">
        <option :value="''">All categories</option>
        <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.name }}</option>
      </select>
      <button @click="refetch()" class="px-3 py-2 bg-gray-900 text-white rounded">Search</button>
      <NuxtLink to="/login" class="ml-auto self-center no-underline text-gray-900">Admin</NuxtLink>
    </div>

    <section>
      <div v-if="loading">Loading...</div>
      <div v-else>
        <div v-if="!posts.length">No posts yet.</div>
        <div class="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-4">
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


