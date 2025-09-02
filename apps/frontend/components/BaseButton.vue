<template>
  <button
    v-bind="$attrs"
    :type="props.type"
    :disabled="props.disabled"
    class="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 focus:outline-none focus:ring"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
const props = defineProps({
  type: { type: String, default: 'button' },
  disabled: { type: Boolean, default: false }
});
</script>
