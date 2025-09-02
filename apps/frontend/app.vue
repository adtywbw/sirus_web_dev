<template>
  <div class="bg-gray-50 min-h-screen">
    <nav class="flex gap-3 px-4 py-3 border-b border-gray-200">
      <NuxtLink to="/" class="text-gray-900 no-underline">Home</NuxtLink>
      <NuxtLink to="/about" class="text-gray-900 no-underline">About</NuxtLink>
      <NuxtLink to="/contact" class="text-gray-900 no-underline">Contact</NuxtLink>
      <NuxtLink to="/login" class="ml-auto text-gray-900 no-underline">Admin</NuxtLink>
    </nav>
    <NuxtPage />
  </div>
</template>


