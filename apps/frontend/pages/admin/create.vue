<template>
  <div class="container">
    <h1>New Post</h1>
    <form @submit.prevent="onSubmit" class="form">
      <label>
        Title
        <input v-model="title" required />
      </label>
      <label>
        Content
        <textarea v-model="content" rows="10" required></textarea>
      </label>
      <label>
        Image URL (optional)
        <input v-model="image_url" />
      </label>
      <label>
        Category (optional)
        <select v-model="category_id">
          <option :value="undefined">-- None --</option>
          <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.name }}</option>
        </select>
      </label>
      <div class="actions">
        <button type="submit" :disabled="loading">{{ loading ? 'Saving…' : 'Create' }}</button>
        <NuxtLink to="/admin" class="btn-outline">Cancel</NuxtLink>
      </div>
      <p v-if="error" class="error">{{ error }}</p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { gql } from '@apollo/client/core';

definePageMeta({ middleware: ['auth'] });

const nuxtApp = useNuxtApp();

const CATEGORIES = gql`query { categories { id name } }`;
const CREATE_POST = gql`
  mutation Create($input: PostInput!) {
    createPost(input: $input) { id }
  }
`;

const title = ref('');
const content = ref('');
const image_url = ref('');
const category_id = ref<string | undefined>(undefined);
const categories = ref<any[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);

onMounted(async () => {
  const { data } = await nuxtApp.$apollo.query({ query: CATEGORIES });
  categories.value = data?.categories ?? [];
});

async function onSubmit() {
  loading.value = true;
  error.value = null;
  try {
    await nuxtApp.$apollo.mutate({
      mutation: CREATE_POST,
      variables: { input: { title: title.value, content: content.value, image_url: image_url.value || null, category_id: category_id.value || null } }
    });
    await navigateTo('/admin');
  } catch (e: any) {
    error.value = e?.message || 'Failed to create post';
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.container { max-width: 720px; margin: 0 auto; padding: 16px; }
.form { display: grid; gap: 12px; }
input, textarea, select { padding: 8px; }
.actions { display: flex; gap: 8px; align-items: center; }
.btn-outline { padding: 8px 12px; border: 1px solid #111827; border-radius: 6px; }
.error { color: #b91c1c; }
</style>

