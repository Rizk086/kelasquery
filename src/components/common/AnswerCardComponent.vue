<script setup>
import { ref } from 'vue'
import TipTapReadOnly from './TipTapReadOnly.vue';
import VoteButtons from './VoteButtons.vue';
import { MessageCircle, Ellipsis } from 'lucide-vue-next';
import { useRoute } from 'vue-router';

const route = useRoute()

const props = defineProps({
  id: String,
  description: String,
  author: String,
  content: Object,
  createdAt: String,
})
</script>

<template>
  <div
    class="block bg-white border-t-2 md:border-2 md:rounded-2xl shadow-lg px-4 pt-4 md:p-4 mb-6 hover:shadow-xl transition-shadow duration-300">
    <span class="font-bold text-2xl md:text-4xl block cursor-default">{{ author }}</span>
    <span class="text-gray-400 text-xs cursor-default">{{ new Date(createdAt).toLocaleDateString('en-US', {
      month: 'long',
    }) }}
      {{ isNaN(new Date(createdAt).getDay()) ? '' : new Date(createdAt).getDate() }}</span>
    <TipTapReadOnly :content="props.content" class="mt-4" />
    <div class="w-full justify-between flex px-10">
      <VoteButtons :id="props?.id" v_type="votes_answer" />
      <div class="flex flex-row gap-4">
        <button
          class="block rounded-lg text-white bg-blue-600 my-4 px-4 py-2 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed">
          <MessageCircle />
        </button>
      </div>
    </div>
  </div>
</template>
