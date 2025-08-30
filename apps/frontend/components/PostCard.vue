<template>
  <article class="card">
    <img v-if="post.image_url" :src="post.image_url" alt="cover" />
    <h3 class="title">
      <NuxtLink :to="`/post/${post.id}`">{{ post.title }}</NuxtLink>
    </h3>
    <p class="meta">By {{ post.author.username }} — {{ new Date(post.created_at).toLocaleDateString() }}</p>
    <p class="excerpt">{{ excerpt }}</p>
  </article>
  
</template>

<script setup lang="ts">
const props = defineProps<{ post: any }>();
const excerpt = computed(() => props.post.content?.slice(0, 120) + (props.post.content?.length > 120 ? '…' : ''));
</script>

<style scoped>
.card { border: 1px solid #e5e7eb; border-radius: 8px; padding: 12px; background: #fff; }
.title { margin: 8px 0; }
.meta { color: #6b7280; font-size: 0.9rem; }
.excerpt { margin-top: 8px; color: #374151; }
img { width: 100%; height: 160px; object-fit: cover; border-radius: 6px; }
</style>

