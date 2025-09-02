<template>
  <div class="max-w-3xl mx-auto p-4">
    <h1 class="text-2xl font-bold">New Post</h1>
    <form @submit.prevent="onSubmit" class="grid gap-3 mt-3">
      <label class="grid gap-1">
        Title
        <input v-model="title" required class="p-2 border rounded" />
      </label>
      <label class="grid gap-1">
        Content
        <textarea v-model="content" rows="10" required class="p-2 border rounded"></textarea>
      </label>
      <label class="grid gap-1">
        Image URL (optional)
        <input v-model="image_url" class="p-2 border rounded" />
      </label>
      <label class="grid gap-1">
        Category (optional)
        <select v-model="category_id" class="p-2 border rounded">
          <option :value="undefined">-- None --</option>
          <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.name }}</option>
        </select>
      </label>
      <div class="flex gap-2 items-center">
        <button type="submit" :disabled="loading" class="px-3 py-2 bg-gray-900 text-white rounded">{{ loading ? 'Saving…' : 'Create' }}</button>
        <NuxtLink to="/admin" class="px-3 py-2 border border-gray-900 text-gray-900 rounded">Cancel</NuxtLink>
      </div>
      <p v-if="error" class="text-red-700">{{ error }}</p>
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



