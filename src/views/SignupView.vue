<script setup>
import { Book } from 'lucide-vue-next'
import { sideNav } from '@/components/components'
import { onMounted, ref } from 'vue'
import { register } from '@/services/auth'
import { generateUsername } from 'unique-username-generator'
import { toast } from 'vue3-toastify'
import "vue3-toastify/dist/index.css"
import { RefreshCcwIcon } from 'lucide-vue-next'
import userInfo from '@/services/userInfo'

sideNav.force_hidden = true
const isRegistered = ref(false)
const randomlyGeneratedUsername = ref(username_generator_9000())
const passwordsReqCheck = ref({ok: false, message: ''})
const usernameReqCheck = ref({ok: true, message: ''})

function username_generator_9000() {
  let username;
  do {
    username = generateUsername("_", Math.floor(Math.random() * 4))
  } while (!/^[a-z0-9_]{3,21}$/.test(username));
  return username;
}

function usernameReqCheckFunction(payload) {
  const usernameInput = payload.target.value
  if (usernameInput.length < 4) {
    usernameReqCheck.value = {ok: false, message: 'Username must be at least 4 characters long'}
  } else if (usernameInput.length > 21) {
    usernameReqCheck.value = {ok: false, message: 'Username must be less than 21 characters long'}
    document.getElementById('username').value = usernameInput.slice(0, 21)
  } else if (!/^[a-z0-9_-]+$/.test(usernameInput)) {
    usernameReqCheck.value = {ok: false, message: 'Username can only contain letters, numbers, and underscores'}
  } else {
    usernameReqCheck.value = {ok: true, message: 'Username looks good!'}
  }
}

function refreshRandomUsername() {
  const newUsername = username_generator_9000()
  document.getElementById('username').value = newUsername
  usernameReqCheckFunction({target: {value: newUsername}})
}

const passwordCheckFunction = () => {
  const password = document.getElementById('password').value
  const cpassword = document.getElementById('cpassword').value
  passwordsReqCheck.value = password === cpassword ? {ok: true, message: 'Passwords match'} : {ok: false, message: 'Passwords do not match'}

  if (password === '' && cpassword === '') {
    passwordsReqCheck.value = false
  } else if (password.length < 8) {
    passwordsReqCheck.value = {ok: false, message: 'Password must be at least 8 characters long'}
  } /* else if (!/[A-Z]/.test(password)) {
    passwordsReqCheck.value = {ok: false, message: 'Password must contain at least one uppercase letter'}
  } else if (!/[a-z]/.test(password)) {
    passwordsReqCheck.value = {ok: false, message: 'Password must contain at least one lowercase letter'}
  } else if (!/[0-9]/.test(password)) {
    passwordsReqCheck.value = {ok: false, message: 'Password must contain at least one number'}
  } else if (!/[\W_]/.test(password)) {
    passwordsReqCheck.value = {ok: false, message: 'Password must contain at least one special character'}
  } */
}

async function registerUser() {
  const email = document.querySelector('#email').value
  const username = usernameReqCheck.value ? document.getElementById('username').value : toast.error('Username does not meet requirements.', {
    position: 'top-right',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  })
  const password = passwordsReqCheck.value ? document.getElementById('password').value : toast.error('Passwords do not match.', {
    position: 'top-right',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  })

  try {
    isRegistered.value = await register(username, email, password)
    if (isRegistered.value) {
      toast.success('Registration successful! Please check your inbox for further verification.', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      })
      setTimeout(() => {
        window.location.href = '/dashboard'
      }, 3000);
    }

  } catch (error) {
    console.error(error)
    toast.error('Registration failed.\n' + error, {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    })
    isRegistered.value = false
  }
}

if (userInfo.isLoggedIn) {
  window.location.href = '/dashboard'
}

onMounted(() => {
  document.getElementById('password').addEventListener('input', passwordCheckFunction)
  document.getElementById('cpassword').addEventListener('input', passwordCheckFunction)
  document.getElementById('username').addEventListener('input', usernameReqCheckFunction)
  document.getElementById('username').value = randomlyGeneratedUsername.value
})
</script>

<template>
  <section class="bg-gray-50">
    <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
      <a href="/" class="flex items-center mb-6 text-2xl font-semibold text-gray-900 select-none">
        <Book class="inline" />
        <span class="inline">KelasQuery</span>
      </a>
      <div class="w-full bg-white border-2 rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
        <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 class="text-xl font-bold leading-tight tracking-tight md:text-2xl text-gray-900">
            Create an account
          </h1>
          <div class="space-y-4 md:space-y-6">
                        <div class="flex flex-row w-full mb-0">
              <div class="basis-3/4">
                <label for="username" class="relative">
                  <input
                    type="text"
                    id="username"
                    placeholder=""
                    class="peer mt-0.5 p-2 w-full rounded border border-gray-300 shadow-sm sm:text-sm"
                    required
                  />
                  <span
                    class="absolute inset-y-0 start-3 -translate-y-5 bg-white px-0.5 text-sm font-medium text-gray-700 transition-transform peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-5"
                  >
                    Username
                  </span>
                </label>
              </div>
              <button
                type="button"
                class="basis-1/4 flex items-center justify-center border border-gray-300 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg text-sm px-4 py-2 ml-4 self-center"
                @click="refreshRandomUsername"
              >
                <!-- refresh icon -->
                <RefreshCcwIcon class="w-5 h-5" />
              </button>
            </div>

            <div>
              <span v-if="!usernameReqCheck.ok" class="text-red-600 text-sm">{{ usernameReqCheck.message }}</span>
            </div>

            <div>
              <label for="email" class="relative">
                <input
                  type="email"
                  id="email"
                  placeholder=""
                  class="peer mt-0.5 p-2 w-full rounded border border-gray-300 shadow-sm sm:text-sm"
                  required
                />
                <span
                  class="absolute inset-y-0 start-3 -translate-y-5 bg-white px-0.5 text-sm font-medium text-gray-700 transition-transform peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-5"
                >
                  Email
                </span>
              </label>
            </div>
            <div>
              <label for="password" class="relative">
                <input
                  type="password"
                  id="password"
                  placeholder=""
                  class="peer mt-0.5 p-2 w-full rounded border border-gray-300 shadow-sm sm:text-sm"
                  required
                />
                <span
                  class="absolute inset-y-0 start-3 -translate-y-5 bg-white px-0.5 text-sm font-medium text-gray-700 transition-transform peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-5"
                >
                  Password
                </span>
              </label>
            </div>
            <div class="mb-0">
              <label for="cpassword" class="relative">
                <input
                  type="password"
                  id="cpassword"
                  placeholder=""
                  class="peer mt-0.5 p-2 w-full rounded border border-gray-300 shadow-sm sm:text-sm"
                  required
                />
                <span
                  class="absolute inset-y-0 start-3 -translate-y-5 bg-white px-0.5 text-sm font-medium text-gray-700 transition-transform peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-5"
                >
                  Confirm Password
                </span>
              </label>
            </div>
            <div>
              <span v-if="!passwordsReqCheck.ok" class="text-red-600 text-sm">{{ passwordsReqCheck.message }}</span>
            </div>
          </div>
          <button
            type="submit"
            @click="registerUser"
            class="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          >
            Sign up
          </button>
        </div>
      </div>
    </div>
  </section>
</template>
