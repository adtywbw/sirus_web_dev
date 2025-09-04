<template>
  <button
    v-bind="$attrs"
    :type="props.type"
    :disabled="props.disabled"
    class="btn btn--primary"
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
