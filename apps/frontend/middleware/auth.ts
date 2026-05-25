export default defineNuxtRouteMiddleware((to) => {
  if (!process.client) return;
  const { isAuthenticated } = useAuth();
  if (to.path.startsWith('/admin') && !isAuthenticated.value) {
    return navigateTo('/login');
  }
});

