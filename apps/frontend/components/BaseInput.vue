<template>
  <input
    v-bind="$attrs"
    :type="props.type"
    :value="props.modelValue"
    @input="onInput"
    class="input"
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
