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
const props = withDefaults(defineProps<{
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
}>(), {
  type: 'button',
  disabled: false
});
</script>
