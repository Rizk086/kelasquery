<script setup>
import NavLink from '@/components/layout/NavLink.vue'
import { onBeforeMount, onMounted, ref, Transition } from 'vue'
import { getPost, sendAnswer, getAnswerFromPost, deletePost } from '@/services/homework'
import { onBeforeRouteLeave, onBeforeRouteUpdate, useRoute } from 'vue-router'
import AnswerCardComponent from '@/components/common/AnswerCardComponent.vue'
import { toast } from 'vue3-toastify'
import "vue3-toastify/dist/index.css"
import TextEditor from '@/components/common/TextEditor.vue'
import TipTapReadOnly from '@/components/common/TipTapReadOnly.vue'
import userInfo from '@/services/userInfo'
import { isTiptapContentEmpty } from '@/utils/tiptap_checker'
import router from '@/router'
import { Ellipsis, MessageCircle } from 'lucide-vue-next'
import VoteButtons from '@/components/common/VoteButtons.vue'
import metadata from '@/services/metadata'
import {
  DropdownMenuArrow,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuItemIndicator,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuRoot,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from 'reka-ui'


const route = useRoute()
const retrievedData = ref("")
const title = ref('')
const subject = ref('')
const permanent_disabled = ref(true)
const answers = ref([])
const displayAnswerDialog = ref(false)
const loaded = ref(false)
const editorRef = ref({})

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
  } 
  catch (err) {
    console.error(err)
    window.location.href = '/404'
  }
}

async function fetchAnswer(id) {
  try {
    answers.value = await getAnswerFromPost(id)
  } catch (err) {
    console.error(err)
  }

}

const post_answer = () => { 
  toast.promise(new Promise(async (resolve, reject) => {
    permanent_disabled.value = true
    try {
      await sendAnswer(
        route.params.id,
        await editorRef.value.getFinalJSONContent()
      )
      setTimeout(() => {
        window.location.reload()
      }, 2000)
      resolve()
    } catch (error) {
      reject({message: error})
    }

  }),
  {
    pending: {
      render() {
        return "Sending answer..."
      }
    },
    success: {
      render() {
        return "Answer posted successfully"
      }
    },
    error: {
      render(err) {
        return `Failed to upload answer\n${err.data?.message}`
      }
    }
  }
  )
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
    dropdown.value = false
  } else {
    displayAnswerDialog.value = false
    editorRef.value?.clearEditor()
  }
}

function copyLink() {
  const link_text = String(window.location.href)
  if (window.isSecureContext && navigator.clipboard) {
    console.log(link_text)
    navigator.clipboard.write(link_text)
      .then(() => toast.success("Link copied"))
      .catch((err) => console.error(err))
  } else {
    unsecureCopyLink(link_text)
  }
}

// will it works? idk
const unsecureCopyLink = (link) => {
  const txarea = document.createElement('textarea')
  txarea.value = link
  document.body.appendChild(txarea)
  txarea.focus()
  txarea.select()

  try {
    document.execCommand('copy')
    toast.info("Link unsecurely copied")
  } catch (error) {
    console.error("Unable to copy: ", error)
  }
  document.body.removeChild(txarea)
}

async function deleteHw() {
  if (confirm("Are you sure want to delete it?")) {
    try {
      await deletePost(route.params?.id)
      loaded.value = false
      toast.success("Homework deleted successfully!", { autoClose: 2000 })
      /* setTimeout(()=> {
        window.location.href = "/homework"
      }, 1000) */
    } catch (error) {
      console.error(error)
    }
  }
}

onBeforeRouteLeave(() => !displayAnswerDialog? editorRef.value?.clearEditor() : true)
onBeforeRouteUpdate(() => !displayAnswerDialog? editorRef.value?.clearEditor() : true)
</script>

<template>
  <NavLink>Homework</NavLink>
  <div
    class="-z-10 hidden md:block absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]">
  </div>
  <div v-if="loaded" class="mb-20">
    <div v-if="!displayAnswerDialog">
      <div
        class="p-4 lg:pt-10 flex flex-col border-b-2 items-center md:m-4 md:border-2 md:rounded-2xl md:shadow-xl bg-white">
        <div class="flex flex-row justify-between w-full mb-8 lg:px-10 sticky top-0 left-0">
          <div>
            <h1 class="text-4xl xl:text-5xl text-left text-pretty font-bold">{{ title }}</h1>
            <span class="text-left font-bold ">{{ metadata.get('user_handle') }}{{ retrievedData.author.username }}</span>
          </div>

          <DropdownMenuRoot>
            <DropdownMenuTrigger class="inline-flex divide-x my-3 xl:my-4 divide-gray-300 overflow-hidden rounded border border-gray-300 bg-white shadow-sm">
              <button type="button" class="px-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900 focus:relative" aria-label="Menu">
                <Ellipsis />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuPortal>
              <DropdownMenuContent align="end" :side-offset="1" class="z-auto w-56 overflow-hidden rounded border border-gray-300 bg-white shadow-sm">
                <DropdownMenuItem>
                  <button @click="copyLink" class="block w-full px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900 text-left" role="menuitem">
                    Copy link
                  </button>
                </DropdownMenuItem>
                <div v-if="userInfo.user_id == retrievedData?.author.id">
                  <DropdownMenuSeparator class="h-px bg-gray-300 mx-[5px]" />
                  <DropdownMenuItem>
                    <button class="block w-full px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900 text-left" role="menuitem">
                      Edit
                    </button>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <button @click="deleteHw" class="block w-full px-3 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-50 ltr:text-left rtl:text-right" role="menuitem">
                      Delete
                    </button>
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenuPortal>
          </DropdownMenuRoot>

          <!-- <Menu as="div" class="relative inline-flex">
            <MenuButton as="span" class="inline-flex divide-x my-3 xl:my-4 divide-gray-300 overflow-hidden rounded border border-gray-300 bg-white shadow-sm">
              <button type="button" class="px-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900 focus:relative" aria-label="Menu">
                <Ellipsis />
              </button>
            </MenuButton>
            
            <transition
              enter-active-class="transition duration-100 ease-out"
              enter-from-class="transform scale-95 opacity-0"
              enter-to-class="transform scale-100 opacity-100"
              leave-active-class="transition duration-75 ease-in"
              leave-from-class="transform scale-100 opacity-100"
              leave-to-class="transform scale-95 opacity-0"
            >
              <MenuItems as="div" class="absolute end-0 top-14 z-999 w-56 divide-y divide-gray-200 overflow-hidden rounded border border-gray-300 bg-white shadow-sm">
                <MenuItem>
                  <button @click="copyLink" class="block w-full px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900 text-left" role="menuitem">
                    Copy link
                  </button>
                </MenuItem>
                <div v-if="userInfo.user_id == retrievedData?.author.id">
                  <MenuItem>
                    <button class="block w-full px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900 text-left" role="menuitem">
                      Edit
                    </button>
                  </MenuItem>
                  <MenuItem>
                    <button @click="deleteHw" class="block w-full px-3 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-50 ltr:text-left rtl:text-right" role="menuitem">
                      Delete
                    </button>
                  </MenuItem>
                </div>
              </MenuItems>
            </transition>
            
          </Menu> -->
        </div>
        <span class="flex items-center w-full lg:px-10 justify-between mb-8">

          <span v-if="retrievedData" class="shrink-0 pr-4 text-gray-900 dark:text-gray-400">{{ new
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
          <div class="w-full justify-between flex md:px-10">
            <div>
              <VoteButtons
              :id="route.params.id"
              :v_type="'votes_post'"
            />
            </div>
            <div class="flex flex-row gap-4">
              <button
                class="block flex-1 rounded text-white bg-blue-600 my-4 px-4 py-2 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                @click="toggleAnswerDialog" :disabled="!loaded">
                <MessageCircle />
              </button>

            </div>
          </div>
      </div>
      <div class="pt-4 md:p-4">
        <span class="text-2xl md:text-4xl font-bold p-4 md:p-0">Answers:</span>
        <div v-if="answers && answers.length > 0" class="mt-4">
          <AnswerCardComponent v-for="(answer, index) in answers" :key="index" :id="answer.id"
            :description="answer.description" :author="`${metadata.get('user_handle')}${answer.author.username}`" :content="answer.content"
            :createdAt="answer.created_at" />
        </div>
        <div v-else class="text-gray-500 p-4 md:p-0 text-center">It's so empty.</div>
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
    <div class="flex items-center justify-center min-h-full p-6">
      <div class="inline-flex items-center gap-3">
        <svg class="size-6 animate-spin text-teal-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      
        <p class="font-medium text-gray-700 select-none">Loading...</p>
      </div>
    </div>
  </div>
</template>
