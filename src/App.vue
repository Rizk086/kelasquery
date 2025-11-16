<script setup>
import { RouterView } from 'vue-router'
import SidebarLink from './components/layout/SidebarLink.vue'
import { sideNav } from './components/components'
import { ref } from 'vue'
import metadata from './services/metadata'

const date = ref(new Date())
const dateString = ref('')
const server = ref(null)

function updateTime() {
  let year = date.value.getFullYear()
  let month = String(date.value.getMonth() + 1).padStart(2, '0')
  let day = String(date.value.getDate()).padStart(2, '0')
  let hours = String(date.value.getHours()).padStart(2, '0')
  let minutes = String(date.value.getMinutes()).padStart(2, '0')
  let seconds = String(date.value.getSeconds()).padStart(2, '0')
  let millisecs = String(date.value.getMilliseconds()).slice(0, 1)

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${millisecs}`
}

setInterval(() => {
  date.value = new Date()
  dateString.value = updateTime()
}, 100)

</script>

<template>
  <div class="flex">
    <SidebarLink v-if="!sideNav.force_hidden" />
    <div class="flex-1 overflow-auto h-screen">
      <span class="text-sm fixed bottom-0 right-0 z-10 text-gray-400 font-mono  select-none">
        <span v-if="metadata.has('error')">DB Server is Not Connected! | </span>
        <span>[{{ dateString }}]</span>
      </span>
      <RouterView></RouterView>
    </div>
  </div>
</template>
