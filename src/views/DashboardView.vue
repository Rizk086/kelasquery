<script setup>
import NavLink from '@/components/layout/NavLink.vue'
import userData from '@/services/userInfo'
import metadata from '@/services/metadata'

</script>

<template>
  <NavLink>Dashboard</NavLink>
  <div
    class="absolute inset-0 -z-10 h-full w-full bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]"
  ></div>
  <div class="md:p-4">
    <h1 class="text-2xl md:text-4xl font-bold px-4 pt-4 md:p-0" v-if="userData.isLoggedIn">Welcome back, {{ userData.username }}!</h1>

    <div class="grid grid-cols-1 lg:grid-cols-2 mt-6 gap-4">
      <div class="flex flex-col border-y-2 md:border-2 bg-white md:shadow md:rounded-lg p-4 md:p-6 lg:p-8 justify-between" v-if="userData.isLoggedIn">
        <h2 class="text-2xl font-semibold">Biodata</h2>
        <dl class="-my-3 divide-y divide-gray-100 text-sm">
          <div class="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
            <dt class="font-medium text-gray-900">Username</dt>
            <dd class="text-gray-700 sm:col-span-2">{{ userData.username }}</dd>
          </div>

          <div class="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
            <dt class="font-medium text-gray-900">Class</dt>
            <dd class="text-gray-700 sm:col-span-2">{{ metadata.get('class_name') }}</dd>
          </div>
        </dl>
      </div>
      <div class="p-4 md:p-6 lg:p-8 border-y-2 md:border-2 bg-white md:rounded-lg md:shadow">
        <h2 class="font-bold text-2xl mb-4 lg:mb-8">KelasQuery</h2>
        <p class="text-pretty">Yet Another Forum to help student(s) to manage their homeworks. Currently still under development.</p>
        <br>
        <p class="text-pretty">
          If you've found a bug or suggestion, you can <a target="_blank" href="https://github.com/Rizk086/kelasquery-web/issues" class="border-b">submit an issue on GitHub.</a>
        </p>
      </div>
    </div>
  </div>
</template>
