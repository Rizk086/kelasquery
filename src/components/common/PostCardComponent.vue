<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

const props = defineProps({
  id: String,
  title: String,
  description: String,
  subject: String,
  createdAt: String,
  author: String,
})

const link = ref(`/homework/${props.id}`)
</script>

<template>
  <!-- <div class="block bg-white border-2 rounded-2xl shadow-lg p-4 mb-6 hover:shadow-xl transition-shadow duration-300">
    <span class="font-bold text-2xl block cursor-default">{{ subject }}</span>
    <span class="text-gray-400 text-xs cursor-default"
      >{{ new Date(createdAt).toLocaleDateString('en-US', {
        month: 'long',
      }) }}
      {{ isNaN(new Date(createdAt).getDay()) ? '' : new Date(createdAt).getDate() }} | {{ author }}</span
    >
    <RouterLink class="text-xl block" :to="link">{{ title }}</RouterLink>
  </div> -->
  <RouterLink :to="link" class="rounded-[10px] border border-gray-200 bg-white p-4 cursor-pointer hover:bg-gray-100 transition duration-300">
    <span class="text-gray-500 text-xs cursor-default"
      >{{ new Date(createdAt).toLocaleDateString('en-US', {
        month: 'long',
      }) }}
      {{ isNaN(new Date(createdAt).getDay()) ? '' : new Date(createdAt).getDate() }} | {{ author }}</span
    >

    <h3 class="mt-0.5 text-lg font-medium text-gray-900">
      {{ title }}
    </h3>

    <div class="mt-4 flex flex-wrap gap-1">
      <span class="rounded-full bg-purple-100 px-2.5 py-0.5 text-xs whitespace-nowrap text-purple-600">
        {{ subject }}
      </span>
    </div>
  </RouterLink>
</template>
