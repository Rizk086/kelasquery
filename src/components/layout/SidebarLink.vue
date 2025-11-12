<script setup>
import { Book } from 'lucide-vue-next'
import { sideNav } from '../components'
import userData from '@/services/userInfo';

const activeClass = 'bg-blue-600 text-white'
</script>

<template>
  <div
    class="fixed inset-0 bg-black opacity-50 z-20 md:hidden transition-all"
    :class="{ 'hidden': !sideNav.state }"
    @click="sideNav.shut()"
  ></div>
  <div
    class="fixed flex h-full flex-col justify-between border-e border-e-gray-200 bg-white z-30 transform duration-300 -translate-x-full md:translate-x-0 md:static md:z-auto md:h-screen max-w-64"
    :class="{ 'translate-x-0': sideNav.state }"
  >
    <div class="px-4 pb-7 pt-5">
      <div class="font-bold text-3xl space-x-1 w-52 items-center mb-24">
        <Book class="inline" />
        <span class="inline">KelasQuery</span>
      </div>

      <ul class="mt-6 space-y-1 overflow-auto">
        <li>
          <RouterLink
            to="/dashboard"
            class="block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-blue-600 hover:text-white"
            :active-class="activeClass"
            @click="sideNav.shut()">
            Dashboard
          </RouterLink>
        </li>

        <li>
          <RouterLink
            to="/homework"
            class="block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-blue-600 hover:text-white"
            :active-class="activeClass"
            @click="sideNav.shut()">
            Homework
          </RouterLink>
        </li>
      </ul>
    </div>
    <div class="sticky inset-x-0 bottom-0 border-t border-gray-100 overflow-x-hidden">
      <RouterLink to="/profile" @click="sideNav.shut()" class="flex items-center gap-2 bg-white p-4 hover:bg-gray-50">
        <div class="size-10 bg-gray-200 rounded-lg"></div>

        <div>
          <p class="text-xs max-w-40 overflow-hidden text-nowrap">
            <strong class="block font-medium" v-if="userData.isLoggedIn">>{{ userData.username }}</strong>
            <strong class="block font-medium" v-else>Anonymous</strong>
          </p>
        </div>
      </RouterLink>
    </div>
  </div>
</template>

