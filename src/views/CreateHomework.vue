<script setup>
import { ref } from 'vue'
import NavLink from '@/components/layout/NavLink.vue'
import { sendPost } from '@/services/homework'
import TextEditor from '@/components/common/TextEditor.vue'
import { toast } from 'vue3-toastify'
import "vue3-toastify/dist/index.css"
import { isTiptapContentEmpty } from '@/utils/tiptap_checker'
import { supabase } from '@/utils/supabase'
import { onBeforeRouteLeave, onBeforeRouteUpdate } from 'vue-router'

const postSended = ref(false)
const subjects = ref()
const ed_content = ref('')
const is_disabled = ref(true)
function handleJSONUpdate(json) {
  console.log('JSON updated:', json)
  ed_content.value = json

  is_disabled.value = isTiptapContentEmpty(ed_content.value) || document.querySelector('#title').value === '' || document.querySelector('#subject').value === ''
}
const editorRef = ref(null)

const handleSendPost = () => {
  toast.promise(new Promise(async (resolve, reject) => {
    is_disabled.value = true
    console.log(document.querySelector('#title').value)
    console.log(document.querySelector('#subject').value)
    const finalContent = await editorRef.value.getFinalJSONContent()
    console.log(finalContent)
    if (isTiptapContentEmpty(finalContent.json)) {
      is_disabled.value = false
      reject({ message: "Content cannot be empty!" })
    }
    try {
      postSended.value = await sendPost(
        document.querySelector('#title').value,
        document.querySelector('#subject').value,
        finalContent.json,
        finalContent.imagePath,
      )
      is_disabled.value = false
      setTimeout(() => {
        window.location.href = '/homework'
      }, 2000)
      resolve()
    } catch (error) {
      is_disabled.value = false
      console.error(error)
      reject({ message: error })
    }
  }),
  {
    pending: {
      render() {
        return "Sending post..."
      }
    },
    success: {
      render() {
        return "Homework successfully created!"
      }
    },
    error: {
      render(err) {
        return `Failed to create homework\n${err.data?.message}`
      }
    }
  }
  )
}

async function getSubjects() {
  const { data } = await supabase
    .from('subjects')
    .select()
  subjects.value = data
}

getSubjects()

onBeforeRouteLeave(() => editorRef.value?.clearEditor())
onBeforeRouteUpdate(() => editorRef.value?.clearEditor())
</script>

<template>
  <NavLink>Create</NavLink>
  <div class="p-4" v-if="!postSended.ok">
    <select name="" id="subject" class="mt-0.5 p-1 w-full rounded border-gray-300 shadow-sm sm:text-sm">
      <option selected disabled value="">Choose a Subject</option>
      <option v-for="(item) in subjects" :key="item.id" :value="item.id">{{ item.name }}</option>
    </select>
    <input type="text" name="" id="title" placeholder="Title" class="my-2 rounded shadow-sm border-gray-300 p-1 w-full" required />
    <div class="min-w-48 mx-auto">
      <TextEditor v-on:update:json="handleJSONUpdate" ref="editorRef" />
    </div>
    <button
      class="block rounded-lg text-white bg-blue-600 my-4 px-4 py-2 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
      @click="handleSendPost()" :disabled="is_disabled">
      Create
    </button>
  </div>
  <div class="p-4" v-else>
    <span>ok</span>
  </div>
</template>
