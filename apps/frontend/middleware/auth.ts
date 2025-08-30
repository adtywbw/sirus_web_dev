export default defineNuxtRouteMiddleware((to) => {
  if (!process.client) return;
  const needsAuth = to.path.startsWith('/admin');
  if (!needsAuth) return;
  const token = localStorage.getItem('token');
  if (!token) {
    return navigateTo('/login');
  }
});

