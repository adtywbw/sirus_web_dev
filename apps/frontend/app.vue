<template>
  <div>
    <nav class="nav">
      <NuxtLink to="/">Home</NuxtLink>
      <NuxtLink to="/about">About</NuxtLink>
      <NuxtLink to="/contact">Contact</NuxtLink>
      <NuxtLink to="/login" class="right">Admin</NuxtLink>
    </nav>
    <NuxtPage />
  </div>
</template>

<style>
.nav { display: flex; gap: 12px; padding: 12px 16px; border-bottom: 1px solid #e5e7eb; }
.nav a { text-decoration: none; color: #111827; }
.nav .right { margin-left: auto; }
body { background: #f9fafb; }
</style>

