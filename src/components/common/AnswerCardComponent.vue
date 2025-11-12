<script setup>
import { ref } from 'vue'
import TipTapReadOnly from './TipTapReadOnly.vue';

const props = defineProps({
  id: String,
  description: String,
  author: String,
  content: Object,
  createdAt: String,
})
</script>

<template>
  <div class="block bg-white border-t-2 md:border-2 md:rounded-2xl shadow-lg px-4 pt-4 md:p-4 mb-6 hover:shadow-xl transition-shadow duration-300">
    <span class="font-bold text-2xl md:text-4xl block cursor-default">{{ author }}</span>
    <span class="text-gray-400 text-xs cursor-default"
      >{{ new Date(createdAt).toLocaleDateString('en-US', {
        month: 'long',
      }) }}
      {{ isNaN(new Date(createdAt).getDay()) ? '' : new Date(createdAt).getDate() }}</span
    >
    <TipTapReadOnly :content="props.content" class="mt-4" />
  </div>
</template>

