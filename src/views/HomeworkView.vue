<script setup>
import CardComponent from '@/components/common/PostCardComponent.vue'
import NavLink from '@/components/layout/NavLink.vue'
import { getPost } from '@/services/homework'
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import userInfo from '@/services/userInfo'
const retrievedData = ref([])
const msg001 = ref('')

async function fetchData() {
  try {
    msg001.value = "Fetching data"
    retrievedData.value = await getPost()
  } catch {
    msg001.value = "Not found"
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
      v-if="userInfo.isLoggedIn"
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
        :author="`>${post.author.username}`"
        class="mb-4"
      ></CardComponent>
    </div>
    <div class="py-3" v-else>
      <div class="p-4 border-2">
        <p>{{ msg001 }}</p>
      </div>
    </div>
  </div>
</template>
