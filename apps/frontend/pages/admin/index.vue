<template>
  <div class="max-w-4xl mx-auto p-4">
    <h1 class="text-2xl font-bold">Admin Dashboard</h1>
    <div class="flex gap-2 items-center mt-3 mb-4">
      <NuxtLink to="/admin/create" class="px-3 py-2 bg-gray-900 text-white rounded">+ New Post</NuxtLink>
      <button class="px-3 py-2 border border-gray-900 text-gray-900 rounded" @click="logout()">Logout</button>
    </div>

    <div v-if="loading">Loading posts…</div>
    <div v-else>
      <table class="w-full border-collapse" v-if="posts.length">
        <thead>
          <tr>
            <th class="text-left border-b border-gray-200 p-2">Title</th>
            <th class="text-left border-b border-gray-200 p-2">Author</th>
            <th class="text-left border-b border-gray-200 p-2">Created</th>
            <th class="text-left border-b border-gray-200 p-2"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in posts" :key="p.id">
            <td class="border-b border-gray-200 p-2">{{ p.title }}</td>
            <td class="border-b border-gray-200 p-2">{{ p.author.username }}</td>
            <td class="border-b border-gray-200 p-2">{{ new Date(p.created_at).toLocaleString() }}</td>
            <td class="border-b border-gray-200 p-2 flex gap-2">
              <NuxtLink :to="`/admin/edit/${p.id}`" class="text-blue-600">Edit</NuxtLink>
              <button @click="onDelete(p.id)" class="text-red-600">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-else>No posts yet.</div>
    </div>
  </div>

</template>

<script setup lang="ts">
import { gql } from '@apollo/client/core';

definePageMeta({ middleware: ['auth'] });

const POSTS = gql`
  query PostsAdmin {
    posts { id title created_at author { id username } }
  }
`;

const DELETE_POST = gql`
  mutation DeletePost($id: ID!) { deletePost(id: $id) }
`;

const nuxtApp = useNuxtApp();
const posts = ref<any[]>([]);
const loading = ref(false);
const { logout } = useAuth();

async function fetchPosts() {
  loading.value = true;
  try {
    const { data } = await nuxtApp.$apollo.query({ query: POSTS, fetchPolicy: 'no-cache' });
    posts.value = data?.posts ?? [];
  } finally {
    loading.value = false;
  }
}

async function onDelete(id: string) {
  if (!confirm('Delete this post?')) return;
  await nuxtApp.$apollo.mutate({ mutation: DELETE_POST, variables: { id } });
  await fetchPosts();
}

onMounted(fetchPosts);
</script>


