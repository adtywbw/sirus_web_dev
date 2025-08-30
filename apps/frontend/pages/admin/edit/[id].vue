<template>
  <div class="container" v-if="loaded">
    <h1>Edit Post</h1>
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
        <button type="submit" :disabled="loading">{{ loading ? 'Saving…' : 'Save' }}</button>
        <NuxtLink to="/admin" class="btn-outline">Cancel</NuxtLink>
      </div>
      <p v-if="error" class="error">{{ error }}</p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { gql } from '@apollo/client/core';

definePageMeta({ middleware: ['auth'] });
const route = useRoute();
const nuxtApp = useNuxtApp();

const POST = gql`query ($id: ID!) { post(id:$id){ id title content image_url category { id } } }`;
const CATEGORIES = gql`query { categories { id name } }`;
const UPDATE_POST = gql`mutation ($id: ID!, $input: PostUpdateInput!) { updatePost(id:$id, input:$input){ id } }`;

const title = ref('');
const content = ref('');
const image_url = ref('');
const category_id = ref<string | undefined>(undefined);
const categories = ref<any[]>([]);
const loading = ref(false);
const loaded = ref(false);
const error = ref<string | null>(null);

onMounted(async () => {
  const [{ data: pData }, { data: cData }] = await Promise.all([
    nuxtApp.$apollo.query({ query: POST, variables: { id: route.params.id } }),
    nuxtApp.$apollo.query({ query: CATEGORIES })
  ]);
  const p = pData?.post;
  if (p) {
    title.value = p.title;
    content.value = p.content;
    image_url.value = p.image_url || '';
    category_id.value = p.category?.id ?? undefined;
  }
  categories.value = cData?.categories ?? [];
  loaded.value = true;
});

async function onSubmit() {
  loading.value = true;
  error.value = null;
  try {
    const input: any = {};
    if (title.value) input.title = title.value;
    if (content.value) input.content = content.value;
    input.image_url = image_url.value || null;
    input.category_id = category_id.value || null;
    await nuxtApp.$apollo.mutate({ mutation: UPDATE_POST, variables: { id: route.params.id, input } });
    await navigateTo('/admin');
  } catch (e: any) {
    error.value = e?.message || 'Failed to update post';
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

