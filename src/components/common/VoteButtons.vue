<script setup>
import { ArrowBigUp } from 'lucide-vue-next';

const props = defineProps({
  postId: {
    type: String,

  }
})
</script>

<template>
  <button class="flex flex-row gap-1 px-4 py-2 rounded shadow bg-white my-4 cursor-pointer">
    <ArrowBigUp />
    <span>0</span>
  </button>
</template>
