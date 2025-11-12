<script setup>
import { sideNav } from '@/components/components'
import { Book } from 'lucide-vue-next'
sideNav.force_hidden = true
</script>

<template>
  <div
    class="absolute inset-0 -z-20 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]"
  ></div>
  <section>
    <div class="mx-auto max-w-screen-xl px-4 py-32 lg:flex lg:h-screen lg:items-center">
      <div class="mx-auto max-w-xl text-center">
        <h1 class="font-extrabold text-5xl bg-white">
          <Book class="inline" :size="48" />KelasQuery
        </h1>

        <p class="mt-4 sm:text-xl/relaxed bg-white">Learning Management Platform</p>
        <div class="mt-8 flex flex-wrap justify-center gap-4">
          <a
            class="block w-full rounded-sm bg-blue-600 px-8 py-3 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:ring-3 focus:outline-hidden sm:w-auto"
            href="/dashboard"
          >
            Dashboard
          </a>

          <a
            class="block w-full rounded-sm px-12 py-3 text-sm font-medium text-blue-600 shadow-sm bg-white hover:text-blue-700 focus:ring-3 focus:outline-hidden sm:w-auto"
            href="/login"
          >
            Sign in
          </a>
        </div>
      </div>
    </div>
  </section>
</template>
