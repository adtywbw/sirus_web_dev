<template>
  <div class="max-w-md mx-auto p-4">
    <h1 class="text-2xl font-bold">Register</h1>
    <form @submit.prevent="onSubmit" class="mt-4 space-y-4">
      <label class="block">
        <span class="block mb-1">Username</span>
        <BaseInput v-model="username" required />
      </label>
      <label class="block">
        <span class="block mb-1">Email</span>
        <BaseInput v-model="email" type="email" required />
      </label>
      <label class="block">
        <span class="block mb-1">Password</span>
        <BaseInput v-model="password" type="password" required />
      </label>
      <BaseButton :disabled="loading" type="submit" class="w-full">{{ loading ? 'Registering…' : 'Register' }}</BaseButton>
      <p v-if="error" class="text-red-600 text-sm">{{ error }}</p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { gql } from '@apollo/client/core';

definePageMeta({ middleware: [] });

const REGISTER = gql`
  mutation Register($username: String!, $email: String!, $password: String!) {
    register(username: $username, email: $email, password: $password) {
      token
      user { id username }
    }
  }
`;

const username = ref('');
const email = ref('');
const password = ref('');
const loading = ref(false);
const error = ref<string | null>(null);
const nuxtApp = useNuxtApp();
const { setToken } = useAuth();

async function onSubmit() {
  loading.value = true;
  error.value = null;
  try {
    const { data } = await nuxtApp.$apollo.mutate({ mutation: REGISTER, variables: { username: username.value, email: email.value, password: password.value } });
    const token = data?.register?.token as string | undefined;
    if (!token) throw new Error('Invalid response');
    setToken(token);
    await navigateTo('/admin');
  } catch (e: any) {
    error.value = e?.message || 'Registration failed';
  } finally {
    loading.value = false;
  }
}
</script>
