<template>
  <div>
    <nav class="nav">
      <NuxtLink to="/" class="logo" aria-label="Go to homepage">
        <img src="/logo.svg" alt="Site logo" />
        <span>Personal Blog</span>
      </NuxtLink>
      <button class="menu-toggle" @click="open = !open" aria-label="Toggle navigation" :aria-expanded="open">
        <span></span>
        <span></span>
        <span></span>
      </button>
      <ul :class="['links', { open }]">
        <li>
          <NuxtLink to="/" :aria-current="$route.path === '/' ? 'page' : undefined">Home</NuxtLink>
        </li>
        <li>
          <NuxtLink to="/about" :aria-current="$route.path === '/about' ? 'page' : undefined">About</NuxtLink>
        </li>
        <li>
          <NuxtLink to="/contact" :aria-current="$route.path === '/contact' ? 'page' : undefined">Contact</NuxtLink>
        </li>
        <li class="admin">
          <NuxtLink to="/login" :aria-current="$route.path === '/login' ? 'page' : undefined">Admin</NuxtLink>
        </li>
      </ul>
    </nav>
    <slot />
    <footer class="footer">
      © {{ new Date().getFullYear() }} Personal Blog • All rights reserved
    </footer>
  </div>
</template>

<script setup>
const open = ref(false);
</script>

<style>
/* Intentionally minimal; primary styles live in assets/css/main.css */
</style>
