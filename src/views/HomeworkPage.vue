<script setup>
import NavLink from '@/components/layout/NavLink.vue'
import { onBeforeMount, onMounted, ref } from 'vue'
import { getPost, sendAnswer, getAnswerFromPost } from '@/services/homework'
import { useRoute } from 'vue-router'
import AnswerCardComponent from '@/components/common/AnswerCardComponent.vue'
import { toast } from 'vue3-toastify'
import "vue3-toastify/dist/index.css"
import TextEditor from '@/components/common/TextEditor.vue'
import TipTapReadOnly from '@/components/common/TipTapReadOnly.vue'
import userInfo from '@/services/userInfo'
import { isTiptapContentEmpty } from '@/utils/tiptap_checker'
import router from '@/router'
import { ThumbsUp, MessageCircle } from 'lucide-vue-next'
import VoteButtons from '@/components/common/VoteButtons.vue'

const route = useRoute()
const retrievedData = ref("")
const title = ref('')
const subject = ref('')
const permanent_disabled = ref(true)
const answers = ref([])
const displayAnswerDialog = ref(false)
const loaded = ref(false)
const editorRef = ref(null)

async function fetchData(id) {
  try {
    retrievedData.value = await getPost(id)
    if (retrievedData.value) {
      title.value = retrievedData.value.title
      subject.value = retrievedData.value.subject
      document.title = title.value + ' :: KelasQuery'
    } else {
      window.location.href = '/404'
    }
  } catch (err) {
    console.error(err)
  }
}

async function fetchAnswer(id) {
  try {
    answers.value = await getAnswerFromPost(id)
  } catch (err) {
    console.error(err)
  }

}

async function post_answer() {
  permanent_disabled.value = true
  try {
    await sendAnswer(
      route.params.id,
      await editorRef.value.getFinalJSONContent()
    )
    toast.success('Answer posted successfully!', {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    })
    setTimeout(() => {
      window.location.reload()
    }, 2000)
  } catch (error) {
    toast.error('Failed to post answer.\n' + error, {
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
onBeforeMount(() => {
  document.title = 'Loading... :: KelasQuery'
})
onMounted(async () => {
  await fetchData(route.params.id)
  await fetchAnswer(route.params.id)
  loaded.value = true
})

const editor_json = ref({})

function handleJSONUpdate(md) {
  editor_json.value = md
  permanent_disabled.value = isTiptapContentEmpty(editor_json.value)
}

function redirectLogin() {
  if (!userInfo.isLoggedIn) {
    router.push('/login')
    return true
  }
}

function toggleAnswerDialog() {
  if (redirectLogin())
    return

  if (!displayAnswerDialog.value) {
    permanent_disabled.value = true
    displayAnswerDialog.value = true
  } else {
    displayAnswerDialog.value = false
  }
}

function vote() {
  redirectLogin()
}
</script>

<template>
  <NavLink>Homework</NavLink>
  <div
    class="-z-10 hidden md:block absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]">
  </div>
  <div v-if="loaded">
    <div v-if="!displayAnswerDialog">
      <div
        class="p-4 md:pt-16 flex flex-col border-b-2 items-center md:m-4 md:border-2 md:rounded-2xl md:shadow-xl bg-white">
        <h1 class="text-4xl xl:text-6xl text-left md:text-center font-bold mb-8 w-full">{{ title }}</h1>
        <span class="text-left font-bold md:text-center mb-8 w-full">>{{ retrievedData.author.username }}</span>
        <span class="flex items-center w-full md:w-96 justify-between mb-8">
          <span class="h-px flex-1 bg-gray-300 dark:bg-gray-600 hidden md:block"></span>

          <span v-if="retrievedData" class="shrink-0 pr-4 md:px-4 text-gray-900 dark:text-gray-400">{{ new
            Date(retrievedData.created_at).toLocaleDateString('en-US', {
              month: 'long',
            }) }}
            {{ isNaN(new Date(retrievedData.created_at).getDay()) ? '' : new Date(retrievedData.created_at).getDate() }}
            | Subject: {{ retrievedData.subject }}</span>

          <span class="h-px flex-1 bg-gray-300 dark:bg-gray-600"></span>
        </span>
        <TipTapReadOnly v-if="retrievedData.content"
          class="w-full prose prose-sm min-h-[200px] overflow-y-auto focus:outline-none"
          :content="retrievedData.content" />
          <div class="w-full justify-between flex px-10">
            <VoteButtons
              :postId="route.params.id"
              />
            <button
              class="block rounded-lg text-white bg-blue-600 my-4 px-4 py-2 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              @click="toggleAnswerDialog" :disabled="!loaded">
              <MessageCircle />
            </button>
          </div>
      </div>
      <div class="pt-4 md:p-4">
        <span class="text-2xl md:text-4xl font-bold p-4 md:p-0">Answers:</span>
        <div v-if="answers && answers.length > 0" class="mt-4">
          <AnswerCardComponent v-for="(answer, index) in answers" :key="index" :id="answer.id"
            :description="answer.description" :author="`>${answer.author.username}`" :content="answer.content"
            :createdAt="answer.created_at" />
        </div>
        <div v-else class="text-gray-500 p-4 md:p-0">No answers yet.</div>
      </div>

    </div>

    <div id="post_answer" class="p-4" v-else>
      <div class="bg-white border border-gray-200 text-center">
        <h2 class="text-2xl md:text-3xl font-bold mt-2 mb-4">Post Your Answer</h2>
        <p class="text-gray-600 mb-4">Please provide your answer below:</p>
      </div>
      <TextEditor v-on:update:json="handleJSONUpdate" ref="editorRef" />
      <div class="flex flex-wrap gap-4 justify-end">
        <button class="rounded-lg text-white bg-blue-600 my-4 px-4 py-2 shadow-xl" @click="toggleAnswerDialog">
          Go Back
        </button>
        <button
          class="rounded-lg text-white bg-blue-600 my-4 px-4 py-2 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          @click="post_answer" :disabled="permanent_disabled">
          Submit Answer
        </button>
      </div>

    </div>

  </div>
  <div v-else>
    <div class="m-4 p-4 bg-white border-2">
      <p>loading</p>
    </div>
  </div>
</template>
