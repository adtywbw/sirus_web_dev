export function useAuth() {
  const token = ref<string | null>(process.client ? localStorage.getItem('token') : null);
  const isAuthenticated = computed(() => !!token.value);

  function setToken(value: string | null) {
    token.value = value;
    if (process.client) {
      if (value) localStorage.setItem('token', value);
      else localStorage.removeItem('token');
    }
  }

  async function logout() {
    setToken(null);
    await navigateTo('/');
  }

  return { token, isAuthenticated, setToken, logout };
}

