<script setup>
import { Book } from 'lucide-vue-next'
import { sideNav } from '@/components/components'
import { ref } from 'vue'
import { login } from '@/services/auth'
import { onBeforeRouteLeave, onBeforeRouteUpdate } from 'vue-router'
sideNav.force_hidden = true

const errorLog = ref('')

async function loginUser() {
  const email = document.getElementById('username').value
  const password = document.getElementById('password').value
  try {
    await login(email, password)
    console.log('success')
    window.location.href = "/dashboard"
  } catch (error) {
    console.error(error)
    errorLog.value = error
  }
}

onBeforeRouteUpdate((to, from) => {
  sideNav.force_hidden = false
})

onBeforeRouteLeave((to, from) => {
  sideNav.force_hidden = false
})
</script>

<template>
  <section class="bg-gray-50">
    <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
      <a href="/" class="flex items-center mb-6 text-2xl font-semibold text-gray-900">
        <Book class="inline" />
        <span class="inline">KelasQuery</span>
      </a>
      <div class="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0 border-2">
        <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 class="text-xl font-bold leading-tight tracking-tight md:text-2xl text-gray-900">
            Welcome!
          </h1>
          <p class="text-sm text-gray-500">
            Please Input the credential provided by Administrator
          </p>
          <div class="space-y-4 md:space-y-6">
            <div>
              <!-- <label for="email" class="block mb-2 text-sm font-medium text-gray-900"
                >Username</label
              > -->
              <!-- <input
                type="text"
                id="username"
                class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
                placeholder="Username"
                required
              /> -->
              <label for="username" class="relative">
                <input
                  type="email"
                  id="username"
                  placeholder=""
                  class="peer mt-0.5 p-2 w-full rounded border border-gray-300 shadow-sm sm:text-sm"
                />
                <span
                  class="absolute inset-y-0 start-3 -translate-y-5 bg-white px-0.5 text-sm font-medium text-gray-700 transition-transform peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-5"
                >
                  Email
                </span>
              </label>
            </div>
            <div>
              <!-- <label for="password" class="block mb-2 text-sm font-medium text-gray-900"
                >Password</label
              > -->
              <!-- <input
                type="password"
                name="password"
                id="password"
                placeholder="Password"
                class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
                required
              /> -->
              <label for="password" class="relative">
                <input
                  type="password"
                  id="password"
                  placeholder=""
                  class="peer mt-0.5 p-2 w-full rounded border border-gray-300 shadow-sm sm:text-sm"
                />
                <span
                  class="absolute inset-y-0 start-3 -translate-y-5 bg-white px-0.5 text-sm font-medium text-gray-700 transition-transform peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-5"
                >
                  Password
                </span>
              </label>

            </div>
            <span>{{ errorLog }}</span>
            <div class="flex items-center justify-between">
              <button class="text-sm font-medium text-blue-600 hover:underline cursor-pointer"
                >Forgot password?</button
              >
            </div>
            <button
              type="submit"
              @click="loginUser"
              class="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            >
              Login
            </button>
            <p class="text-sm font-light text-gray-500">
              Don’t have an account yet?
              <a href="/register" class="font-medium text-blue-600 hover:underline">Sign up</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
