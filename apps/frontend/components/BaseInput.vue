<template>
  <input
    v-bind="$attrs"
    :type="props.type"
    :value="props.modelValue"
    @input="onInput"
    class="border rounded w-full px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
  />
</template>

<script setup lang="ts">
const props = defineProps({
  modelValue: { type: [String, Number], default: '' },
  type: { type: String, default: 'text' }
});
const emit = defineEmits(['update:modelValue']);

function onInput(e: Event) {
  emit('update:modelValue', (e.target as HTMLInputElement).value);
}
</script>
