<template>
  <div class="max-w-2xl mx-auto p-4">
    <h1 class="text-2xl font-bold">New Post</h1>
    <form @submit.prevent="onSubmit" class="mt-4 space-y-4">
      <label class="block">
        <span class="block mb-1">Title</span>
        <BaseInput v-model="title" required />
      </label>
      <label class="block">
        <span class="block mb-1">Content</span>
        <textarea v-model="content" rows="10" required class="border rounded w-full px-3 py-2 focus:ring focus:border-blue-300"></textarea>
      </label>
      <label class="block">
        <span class="block mb-1">Image URL (optional)</span>
        <BaseInput v-model="image_url" />
      </label>
      <label class="block">
        <span class="block mb-1">Category (optional)</span>
        <select v-model="category_id" class="border rounded w-full px-3 py-2 focus:ring focus:border-blue-300">
          <option :value="undefined">-- None --</option>
          <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.name }}</option>
        </select>
      </label>
      <div class="flex items-center gap-2">
        <BaseButton type="submit" :disabled="loading">{{ loading ? 'Saving…' : 'Create' }}</BaseButton>
        <NuxtLink to="/admin" class="px-4 py-2 border border-gray-900 rounded text-gray-900 hover:bg-gray-100">Cancel</NuxtLink>
      </div>
      <p v-if="error" class="text-red-600 text-sm">{{ error }}</p>
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
