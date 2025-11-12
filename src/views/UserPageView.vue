<template>
  <ModalBox :modal="modal" @close="modal.handleClose" @update="modal.handleUpdate" />
  <NavLink>Profile</NavLink>
  <section class="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg" v-if="userData.isLoggedIn">
    <div class="flex items-center space-x-4">
      <div class="bg-gray-100 rounded-full p-3">
        <UserIcon class="w-10 h-10 text-gray-500" />
      </div>
      <div>
        <h2 class="text-2xl font-bold text-gray-800">{{ metadata.get('user_handle') }}{{ userData.username }}</h2>
      </div>
    </div>

    <div class="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
      <button
        @click="changePassword"
        class="flex items-center w-full px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
      >
        <LockIcon class="w-5 h-5 text-gray-600 mr-3" />
        <span class="text-gray-700 font-medium">Change Password</span>
      </button>
      <button
        @click="logout"
        class="flex items-center w-full px-4 py-3 bg-red-50 rounded-lg hover:bg-red-100 transition"
      >
        <LogOutIcon class="w-5 h-5 text-red-600 mr-3" />
        <span class="text-red-700 font-medium">Logout</span>
      </button>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import userData from '@/services/userInfo.js'
import { User as UserIcon, Edit as EditIcon, Lock as LockIcon, LogOut as LogOutIcon } from 'lucide-vue-next'
import NavLink from '@/components/layout/NavLink.vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/utils/supabase'
import { modal } from '@/components/components'
import ModalBox from '@/components/common/ModalBox.vue'
import metadata from '@/services/metadata'
import { toast } from 'vue3-toastify'

const router = useRouter()

function editProfile() {
  // TODO: Implement edit profile logic
  alert('Edit profile clicked')
}

function changePassword() {
  // TODO: Implement change password logic
  alert('Change password clicked')
}

function logout() {
  // Implement logout logic
  modal.popup('Confirm Logout', 'Are you sure you want to logout?', '', '', 'Logout', false)
    .then(async (result) => {
      if (result) {
        try {
          await supabase.auth.signOut()
          toast.info("You've logged out", {
            autoClose: 3000,
          })
          router.push('/')
        } catch (error) {
          console.error('Error during logout:', error)
        }
      }
    })
}

if (!userData.isLoggedIn)
  router.push('/login')
</script>

<style scoped>
/* You can add additional styling here if needed */
</style>
