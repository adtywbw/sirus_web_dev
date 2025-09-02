<template>
  <div class="max-w-md mx-auto p-4">
    <h1 class="text-2xl font-bold">Login</h1>
    <form @submit.prevent="onSubmit" class="grid gap-3 mt-3">
      <label class="grid gap-1">
        Username
        <input v-model="username" required class="p-2 border rounded" />
      </label>
      <label class="grid gap-1">
        Password
        <input v-model="password" type="password" required class="p-2 border rounded" />
      </label>
      <button :disabled="loading" type="submit" class="py-2 px-3 bg-gray-900 text-white rounded">{{ loading ? 'Signing in…' : 'Login' }}</button>
      <NuxtLink to="/register" class="inline-block mt-2 text-blue-600">Need an account? Register</NuxtLink>
      <p v-if="error" class="text-red-700">{{ error }}</p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { gql } from '@apollo/client/core';

definePageMeta({ middleware: [] });

const LOGIN = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      token
      user { id username }
    }
  }
`;

const username = ref('');
const password = ref('');
const loading = ref(false);
const error = ref<string | null>(null);
const nuxtApp = useNuxtApp();
const { setToken } = useAuth();

async function onSubmit() {
  loading.value = true;
  error.value = null;
  try {
    const { data } = await nuxtApp.$apollo.mutate({ mutation: LOGIN, variables: { username: username.value, password: password.value } });
    const token = data?.login?.token as string | undefined;
    if (!token) throw new Error('Invalid response');
    setToken(token);
    await navigateTo('/admin');
  } catch (e: any) {
    error.value = e?.message || 'Login failed';
  } finally {
    loading.value = false;
  }
}
</script>


