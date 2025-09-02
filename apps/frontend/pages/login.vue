<template>
  <div class="max-w-md mx-auto p-4">
    <h1 class="text-2xl font-bold">Login</h1>
    <form @submit.prevent="onSubmit" class="mt-4 space-y-4">
      <label class="block">
        <span class="block mb-1">Username</span>
        <BaseInput v-model="username" required />
      </label>
      <label class="block">
        <span class="block mb-1">Password</span>
        <BaseInput v-model="password" type="password" required />
      </label>
      <BaseButton :disabled="loading" type="submit" class="w-full">{{ loading ? 'Signing in…' : 'Login' }}</BaseButton>
      <NuxtLink to="/register" class="text-blue-600 hover:underline block">Need an account? Register</NuxtLink>
      <p v-if="error" class="text-red-600 text-sm">{{ error }}</p>
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
