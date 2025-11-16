<script setup>
import CardComponent from '@/components/common/PostCardComponent.vue'
import NavLink from '@/components/layout/NavLink.vue'
import { getPost } from '@/services/homework'
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import userInfo from '@/services/userInfo'
import metadata from '@/services/metadata'
const retrievedData = ref([])
const loaded = ref([])

async function fetchData() {
  try {
    let message = "Fetching data"
    loaded.value = [message, true]
    retrievedData.value = await getPost()
  } catch {
    loaded.value = ["Not found", false]
    retrievedData.value = null
  }
}

onMounted(async () => {
  await fetchData()
})

</script>

<template>
  <NavLink>Homework</NavLink>
  <div class="p-4">
    <RouterLink
      class="block w-fit px-4 py-2 bg-blue-600 text-white rounded-lg"
      to="/homework/create"
      v-if="userInfo.isLoggedIn && retrievedData!='' && retrievedData"
      >Create</RouterLink
    >
    
    <div class="py-4 grid lg:grid-cols-3 gap-x-4" v-if="retrievedData!='' && retrievedData">
      <CardComponent
        v-for="post in retrievedData"
        :key="post.id"
        :title="post.title"
        :description="post.description"
        :subject="post.subject"
        :createdAt="post.created_at"
        :id="post.id"
        :author="`${metadata.get('user_handle')}${post.author.username}`"
        class="mb-4"
      ></CardComponent>
    </div>
    <div class="py-3" v-else>
      <!-- <div class="p-4 border-2">
        <p>{{ msg001 }}</p>
      </div> -->
      <div class="flex min-h-full items-center justify-center p-6">
        <div class="inline-flex items-center gap-3">
          <svg v-if="loaded[1]" class="size-6 animate-spin text-teal-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        
          <p class="font-medium text-gray-700 select-none">{{ loaded[0] }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
