<script setup>
import { Menu } from 'lucide-vue-next'
import { sideNav } from '../components'
import userData from '@/services/userInfo';
</script>

<template>
  <div
    class="sticky top-0 flex flex-row p-4 justify-between bg-white border-b border-gray-200 z-10"
  >
    <button class="md:hidden" @click="sideNav.toggle()">
      <Menu />
    </button>
    <div class="pt-1">
      <h1 class="font-bold text-3xl">
        <slot />
      </h1>
    </div>

    <div>
      <a
        class="block bg-blue-600 rounded-lg px-4 py-2 text-white hover:bg-blue-700 transition duration-300 md:px-5 md:py-2.5"
        href="/login"
        v-if="!userData.isLoggedIn"
        >Login</a
      >
    </div>
  </div>
</template>
