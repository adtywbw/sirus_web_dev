<template>
  <div class="container">
    <h1>Login</h1>
    <form @submit.prevent="onSubmit" class="form">
      <label>
        Username
        <input v-model="username" required />
      </label>
      <label>
        Password
        <input v-model="password" type="password" required />
      </label>
      <button :disabled="loading" type="submit">{{ loading ? 'Signing in…' : 'Login' }}</button>
      <NuxtLink to="/register" class="link">Need an account? Register</NuxtLink>
      <p v-if="error" class="error">{{ error }}</p>
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

<style scoped>
.container { max-width: 420px; margin: 0 auto; padding: 16px; }
.form { display: grid; gap: 12px; margin-top: 12px; }
label { display: grid; gap: 4px; }
input { padding: 8px; }
button { padding: 10px; }
.error { color: #b91c1c; }
.link { display: inline-block; margin-top: 8px; }
</style>
