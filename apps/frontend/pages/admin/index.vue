<template>
  <div class="container">
    <h1>Admin Dashboard</h1>
    <div class="topbar">
      <NuxtLink to="/admin/create" class="btn">+ New Post</NuxtLink>
      <button class="btn-outline" @click="logout()">Logout</button>
    </div>

    <div v-if="loading">Loading posts…</div>
    <div v-else>
      <table class="table" v-if="posts.length">
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Created</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in posts" :key="p.id">
            <td>{{ p.title }}</td>
            <td>{{ p.author.username }}</td>
            <td>{{ new Date(p.created_at).toLocaleString() }}</td>
            <td class="actions">
              <NuxtLink :to="`/admin/edit/${p.id}`">Edit</NuxtLink>
              <button @click="onDelete(p.id)">Delete</button>
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

<style scoped>
.container { max-width: 960px; margin: 0 auto; padding: 16px; }
.topbar { display: flex; gap: 8px; align-items: center; margin: 12px 0 16px; }
.btn, .btn-outline { padding: 8px 12px; }
.btn { background: #111827; color: white; border-radius: 6px; }
.btn-outline { background: transparent; color: #111827; border: 1px solid #111827; border-radius: 6px; }
.table { width: 100%; border-collapse: collapse; }
th, td { text-align: left; border-bottom: 1px solid #e5e7eb; padding: 8px; }
.actions { display: flex; gap: 8px; }
</style>
