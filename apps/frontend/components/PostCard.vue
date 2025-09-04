<template>
  <article class="card">
    <img
      v-if="post.image_url"
      :src="post.image_url"
      alt="cover"
    />
    <h3>
      <NuxtLink :to="`/post/${post.id}`">{{ post.title }}</NuxtLink>
    </h3>
    <p class="meta">By {{ post.author.username }} • {{ new Date(post.created_at).toLocaleDateString() }}</p>
    <p>{{ excerpt }}</p>
  </article>
</template>

<script setup lang="ts">
const props = defineProps<{ post: any }>();
const excerpt = computed(() => {
  const txt = (props.post.content || '').replace(/\s+/g, ' ').trim();
  if (!txt) return '';
  return txt.length > 140 ? txt.slice(0, 140) + '…' : txt;
});
</script>

