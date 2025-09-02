<template>
  <div>
    <nav class="nav">
      <NuxtLink to="/" class="logo">
        <img src="/logo.svg" alt="Site logo" />
      </NuxtLink>
      <button class="menu-toggle" @click="open = !open" aria-label="Toggle navigation">
        <span></span>
        <span></span>
        <span></span>
      </button>
      <ul :class="['links', { open }]">
        <li><NuxtLink to="/" :class="{ 'text-blue-600': $route.path === '/' }">Home</NuxtLink></li>
        <li><NuxtLink to="/about" :class="{ 'text-blue-600': $route.path === '/about' }">About</NuxtLink></li>
        <li><NuxtLink to="/contact" :class="{ 'text-blue-600': $route.path === '/contact' }">Contact</NuxtLink></li>
        <li class="admin"><NuxtLink to="/login" :class="{ 'text-blue-600': $route.path === '/login' }">Admin</NuxtLink></li>
      </ul>
    </nav>
    <slot />
  </div>
</template>

<script setup>
const open = ref(false);
</script>

<style>
.nav {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #e5e7eb;
  background: white;
}
.logo img {
  height: 32px;
  width: 32px;
}
.links {
  display: flex;
  list-style: none;
  gap: 12px;
  margin: 0;
  padding: 0;
}
.links a {
  text-decoration: none;
  color: #111827;
}
.admin {
  margin-left: auto;
}
.menu-toggle {
  display: none;
  flex-direction: column;
  gap: 4px;
  background: transparent;
  border: none;
  cursor: pointer;
  margin-left: auto;
}
.menu-toggle span {
  width: 24px;
  height: 2px;
  background: #111827;
}
.text-blue-600 {
  color: #2563eb;
}
@media (max-width: 640px) {
  .menu-toggle {
    display: flex;
  }
  .links {
    display: none;
    position: absolute;
    top: 56px;
    left: 0;
    right: 0;
    flex-direction: column;
    background: white;
    padding: 8px 16px;
  }
  .links.open {
    display: flex;
  }
  .admin {
    margin-left: 0;
  }
}
</style>
