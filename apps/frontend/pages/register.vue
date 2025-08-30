<template>
  <div class="container">
    <h1>Register</h1>
    <form @submit.prevent="onSubmit" class="form">
      <label>
        Username
        <input v-model="username" required />
      </label>
      <label>
        Email
        <input v-model="email" type="email" required />
      </label>
      <label>
        Password
        <input v-model="password" type="password" required />
      </label>
      <button :disabled="loading" type="submit">{{ loading ? 'Registering…' : 'Register' }}</button>
      <p v-if="error" class="error">{{ error }}</p>
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

<style scoped>
.container { max-width: 420px; margin: 0 auto; padding: 16px; }
.form { display: grid; gap: 12px; margin-top: 12px; }
label { display: grid; gap: 4px; }
input { padding: 8px; }
button { padding: 10px; }
.error { color: #b91c1c; }
</style>

