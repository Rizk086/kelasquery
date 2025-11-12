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
  console.log(isTiptapContentEmpty(ed_content.value))
  console.log(document.querySelector('#title').value === '')
  console.log(document.querySelector('#subject').value === '')
  console.log(is_disabled.value)
}
const editorRef = ref(null)

async function handleSendPost() {
  is_disabled.value = true
  console.log(document.querySelector('#title').value)
  console.log(document.querySelector('#subject').value)
  const json_content = await editorRef.value.getFinalJSONContent()
  console.log(json_content)
  if (isTiptapContentEmpty(json_content)) {
    toast.error('Content cannot be empty!', {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    })
    is_disabled.value = false
    return
  }
  try {
    postSended.value = await sendPost(
      document.querySelector('#title').value,
      document.querySelector('#subject').value,
      json_content
    )
    is_disabled.value = false
    toast.success('Homework created successfully!', {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    })
    /* setTimeout(() => {
      window.location.href = '/homework'
    }, 2000) */
  } catch (error) {
    is_disabled.value = false
    console.error(error)
    toast.error('Failed to create homework.\n' + error, {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    })
  }
}

async function getSubjects() {
  const { data } = await supabase
  .from('subjects')
  .select()
  subjects.value = data
}

getSubjects()

onBeforeRouteLeave(() => {
  editorRef.value?.clearEditor()
  return true
})

onBeforeRouteUpdate(() => {
  editorRef.value?.clearContent()
  return true
})
</script>

<template>
  <NavLink>Create</NavLink>
  <div class="p-4" v-if="!postSended.ok">
    <span class="text-2xl font-bold">Title:</span><br />
    <input
      type="text"
      name=""
      id="title"
      class="my-2 rounded-lg border border-gray-800 p-1 w-full"
      required
    /><br />
    <span class="text-2xl font-bold">Subject: </span>
    <select name="" id="subject" class="mx-4 px-4 text-xl font-bold border border-gray-800 rounded-lg">
      <option selected disabled value="">Choose one</option>
      <option v-for="(item) in subjects" :key="item.id" :value="item.id">{{ item.name }}</option>
    </select>
    <div class="min-w-48 mx-auto">
      <span class="text-2xl font-bold">Content:</span>
      <TextEditor
        v-on:update:json="handleJSONUpdate"
        ref="editorRef"
      />
    </div>
    <button
      class="block rounded-lg text-white bg-blue-600 my-4 px-4 py-2 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
      @click="handleSendPost()"
      :disabled="is_disabled"
    >
      Create
    </button>
  </div>
  <div class="p-4" v-else>
    <span>ok</span>
  </div>
</template>
