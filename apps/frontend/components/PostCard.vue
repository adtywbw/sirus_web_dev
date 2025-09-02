<template>
  <article class="border border-gray-200 rounded p-3 bg-white">
    <img
      v-if="post.image_url"
      :src="post.image_url"
      alt="cover"
      class="w-full h-40 object-cover rounded-md"
    />
    <h3 class="my-2 text-lg font-semibold">
      <NuxtLink :to="`/post/${post.id}`">{{ post.title }}</NuxtLink>
    </h3>
    <p class="text-gray-600 text-sm">By {{ post.author.username }} — {{ new Date(post.created_at).toLocaleDateString() }}</p>
    <p class="mt-2 text-gray-700">{{ excerpt }}</p>
  </article>

</template>

<script setup lang="ts">
const props = defineProps<{ post: any }>();
const excerpt = computed(() =>
  props.post.content?.slice(0, 120) +
  (props.post.content?.length > 120 ? '…' : '')
);
</script>


