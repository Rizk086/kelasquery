<template>
  <ModalBox
    :modal="modal"
    @close="modal.handleClose"
    @update="modal.handleUpdate"
  />
  <div class="bg-white rounded-lg shadow-md p-4 border border-gray-200">
    <!-- Toolbar -->
    <div class="flex flex-wrap items-center gap-2 mb-2 border-b pb-2">
      <button @click="editor.chain().focus().toggleBold().run()" :class="toolbarBtn('bold')" title="Bold">
        <LucideBold class="w-5 h-5" />
      </button>
      <button @click="editor.chain().focus().toggleItalic().run()" :class="toolbarBtn('italic')" title="Italic">
        <LucideItalic class="w-5 h-5" />
      </button>
      <button @click="editor.chain().focus().toggleStrike().run()" :class="toolbarBtn('strike')" title="Strike">
        <LucideStrikethrough class="w-5 h-5" />
      </button>
      <button @click="editor.chain().focus().toggleHeading({ level: 1 }).run()" :class="toolbarBtn('heading', 1)" title="Heading 1">
        <LucideHeading1 class="w-5 h-5" />
      </button>
      <button @click="editor.chain().focus().toggleHeading({ level: 2 }).run()" :class="toolbarBtn('heading', 2)" title="Heading 2">
        <LucideHeading2 class="w-5 h-5" />
      </button>
      <button @click="editor.chain().focus().toggleBulletList().run()" :class="toolbarBtn('bulletList')" title="Bullet List">
        <LucideList class="w-5 h-5" />
      </button>
      <button @click="editor.chain().focus().toggleOrderedList().run()" :class="toolbarBtn('orderedList')" title="Ordered List">
        <LucideListOrdered class="w-5 h-5" />
      </button>
      <button @click="editor.chain().focus().toggleCodeBlock().run()" :class="toolbarBtn('codeBlock')" title="Code Block">
        <LucideCode class="w-5 h-5" />
      </button>
      <button @click="showMath = !showMath" :class="toolbarBtn()" title="Math">
        <LucideSigma class="w-5 h-5" />
      </button>
      <button @click="setLink" :class="toolbarBtn('link')" title="Insert Link">
        <LucideLinkIcon class="w-5 h-5" />
      </button>
      <button @click="editor.chain().focus().undo().run()" class="md2-btn" title="Undo">
        <LucideUndo class="w-5 h-5" />
      </button>
      <button @click="editor.chain().focus().redo().run()" class="md2-btn" title="Redo">
        <LucideRedo class="w-5 h-5" />
      </button>
      <button @click="triggerImageUpload" class="md2-btn" title="Insert Image">
        <LucideImage class="w-5 h-5" />
      </button>
      <br />
      <div v-if="showMath" class="flex items-center gap-2">
        <button @click="onInsertInlineMath" :class="toolbarBtn()" title="Inline Math">
          <span class="text-sm">Insert Inline</span>
        </button>
        <button @click="onRemoveInlineMath" :class="toolbarBtn()" title="Remove Inline Math">
          <span class="text-sm">Remove Inline</span>
        </button>
        <button @click="onInsertBlockMath" :class="toolbarBtn()" title="Block Math">
          <span class="text-sm">Insert Block</span>
        </button>
        <button @click="onRemoveBlockMath" :class="toolbarBtn()" title="Remove Block Math">
          <span class="text-sm">Remove Block</span>
        </button>
      </div>
      <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="handleImageUpload" />
    </div>
    <!-- Editor -->
    <EditorContent :editor="editor" class="prose prose-sm max-w-none min-h-[200px] focus:outline-none" />
    <div class="border-t">
      <span class="text-gray-500 text-sm">{{ countImage }} image(s) ready to upload</span>
    </div>
  </div>
</template>

<script setup>
import ModalBox from './ModalBox.vue'
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { Editor, EditorContent } from '@tiptap/vue-3'
// Start of Tiptap extensions imports
import StarterKit from '@tiptap/starter-kit'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import ImageEX from '@tiptap/extension-image'
import FileHandler from '@tiptap/extension-file-handler'
import { Mathematics, migrateMathStrings } from '@tiptap/extension-mathematics'
import Placeholder from '@tiptap/extension-placeholder'
import { createLowlight, common } from 'lowlight'
import js from 'highlight.js/lib/languages/javascript'
import css from 'highlight.js/lib/languages/css'
import html from 'highlight.js/lib/languages/xml'
import 'highlight.js/styles/monokai.css'
// End of Tiptap extensions imports
import { modal } from '../components'
import "katex/dist/katex.min.css"
// Lucide icons
import { Bold as LucideBold, Italic as LucideItalic, Strikethrough as LucideStrikethrough, Heading1 as LucideHeading1, Heading2 as LucideHeading2, List as LucideList, ListOrdered as LucideListOrdered, Code as LucideCode, Sigma as LucideSigma, Undo as LucideUndo, Redo as LucideRedo, Image as LucideImage, LinkIcon as LucideLinkIcon } from 'lucide-vue-next'
import { toast } from 'vue3-toastify'
import { supabase } from '@/utils/supabase'

const lowlight = createLowlight(common)
// Register highlight.js languages
lowlight.register({js})
lowlight.register({css})
lowlight.register({html})

const showMath = ref(false)

const fileInput = ref(null)
const emit = defineEmits(['update:json'])

const editor = ref(null)
const pendingImages = ref(new Map())
const maxFileSize = 5 * 1024 * 1024 // 5 MB
const maxImageWidth = 1920
const maxImageHeight = 1080
const countImage = ref(0)

const toolbarBtn = (type, level = null) => {
  let active = false
  if (!editor.value) return 'md2-btn'
  switch (type) {
    case 'bold': active = editor.value.isActive('bold'); break
    case 'italic': active = editor.value.isActive('italic'); break
    case 'strike': active = editor.value.isActive('strike'); break
    case 'heading': active = editor.value.isActive('heading', { level }); break
    case 'bulletList': active = editor.value.isActive('bulletList'); break
    case 'orderedList': active = editor.value.isActive('orderedList'); break
    case 'codeBlock': active = editor.value.isActive('codeBlock'); break
    case 'math': active = editor.value.isActive('math'); break
    case 'link': active = editor.value.isActive('link'); break
    default: active = false; break
  }
  return active ? 'md2-btn md2-btn-active' : 'md2-btn'
}

const CustomImage = ImageEX.extend({
  name: 'customImage',
  addAttributes() {
    return {
      ...this.parent?.(),
      'data-temp-id': {
        default: null,
      }
    }
  },
})

const triggerImageUpload = () => {
  fileInput.value.click()
}

const handleImageUpload = async (e) => {
  const file = e.target.files[0]
  if (!file) return
  console.log(file)
  const data = await handleImageFile(file)
  if (data)
    editor.value.chain().focus().setImage({ src: `${data.url}`, 'data-temp-id': data.tempId }).run()

  // Clear the input value to allow uploading the same file again if needed
  e.target.value = ''
}

const handleImageFile = async (e) => {
  if (e.size > maxFileSize) {
    toast.error('Image size exceeds 5 MB limit.', {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    })
    return null
  }

  try {
    const processedFile = await validateAndResizeImage(e)
    return imagePreviewData(processedFile)
  } catch (error) {
    console.error('Error processing image:', error)
    toast.error('Error processing image: ' + error.message, {
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

const validateAndResizeImage = (file) => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const reader = new FileReader()

    reader.onload = (e) => {
      img.src = e.target.result
    }

    img.onload = () => {
      const width = img.width
      const height = img.height

      // Check if resizing is needed
      if (width <= maxImageWidth && height <= maxImageHeight) {
        // No resizing needed
        resolve(file)
        return
      }

      // Calculate new dimensions maintaining aspect ratio
      let newWidth = width
      let newHeight = height

      if (width > maxImageWidth) {
        newWidth = maxImageWidth
        newHeight = (height * maxImageWidth) / width
      }

      if (newHeight > maxImageHeight) {
        newHeight = maxImageHeight
        newWidth = (width * maxImageHeight) / height
      }

      // Create canvas and resize
      const canvas = document.createElement('canvas')
      canvas.width = newWidth
      canvas.height = newHeight

      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, newWidth, newHeight)

      // Convert canvas to blob
      canvas.toBlob((blob) => {
        if (blob) {
          // Create new file from blob with original name
          const resizedFile = new File([blob], file.name, {
            type: file.type,
            lastModified: Date.now()
          })

          console.log(`Image resized from ${width}x${height} to ${newWidth}x${newHeight}`)
          resolve(resizedFile)
        } else {
          reject(new Error('Failed to create blob'))
        }
      }, file.type, 0.9) // 0.9 quality for JPEG
    }

    img.onerror = () => {
      reject(new Error('Failed to load image'))
    }

    reader.onerror = () => {
      reject(new Error('Failed to read file'))
    }

    reader.readAsDataURL(file)
  })
}

const imagePreviewData = (file) => {
  const tempId = `temp-${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  const blobUrl = URL.createObjectURL(file)

  pendingImages.value.set(tempId, {
    file: file,
    blobUrl: blobUrl,
    name: file.name,
    size: file.size
  })
  return { url: blobUrl, tempId }
}

async function actualImageUpload(file) {
  console.log('Uploading image:', file)
  const path = `images/${Date.now()}_${file.name}`
  console.log('Uploading to path:', path)
  const { error: supaError } = supabase.storage
    .from('post-images')
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false
    })
  if (supaError) {
    console.error('Supabase upload error:', supaError)
    toast.error('Image upload failed.' + supaError.message, {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    })
    return null
  }
  try {
    const { data } = supabase.storage.from('post-images').getPublicUrl(path)
    console.log('Public URL data:', data)
    return { url: data.publicUrl }
  } catch (error) {
    console.error('Error getting public URL:', error)
    toast.error('Image upload failed.' + error, {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    })
    return null
  }
}

// Count image nodes in JSON
const countImageInJSON = (json) => {
  let count = 0

  const traverse = (node) => {
    if (node.type === 'customImage') {
      count++
    }
    if (node.content && Array.isArray(node.content)) {
      node.content.forEach(child => traverse(child))
    }
  }

  traverse(json)
  return count
}


function setLink() {
  const prevURL = editor.value.getAttributes('link').href
  modal.popup('Insert Link', 'Enter the URL:', 'Insert', prevURL).then((url) => {
    if (url) {
      editor.value.chain().focus().setLink({ href: url }).run()
    }
  })
}

function onInsertInlineMath() {
  const hasSelection = !editor.value.state.selection.empty
  if (hasSelection) {
    return editor.value.chain().insertInlineMath().focus().run()
  }

  modal.popup('Insert Inline Math', 'Enter the LaTeX expression:', 'Insert').then((latex) => {
    if (latex) {
      editor.value.chain().insertInlineMath({ latex }).focus().run()
    }
  })
}

function onRemoveInlineMath() {
  editor.value.chain.deleteInlineMath().focus().run()
}

function onInsertBlockMath() {
  const hasSelection = !editor.value.state.selection.empty
  if (hasSelection) {
    return editor.value.chain().insertBlockMath().focus().run()
  }

  modal.popup('Insert Block Math', 'Enter the LaTeX expression:', 'Insert').then((latex) => {
    if (latex) {
      editor.value.chain().insertBlockMath({ latex }).focus().run()
    }
  })
}

function onRemoveBlockMath() {
  editor.value.chain().deleteBlockMath().focus().run()
}

onMounted(() => {
  editor.value = new Editor({
    extensions: [
      StarterKit.configure({
        codeBlock: false, // Disable default code block to use our custom one
      }),
      CodeBlockLowlight.configure({ lowlight }),
      CustomImage.configure({
        inline: false,
        allowBase64: true,
      }),
      FileHandler.configure({
        allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif'],
        onDrop: (currentEditor, files, pos) => {
          files.forEach(async (file) => {
            console.log('File dropped:', file)
            const data = await handleImageFile(file)
            if (!data) return
            console.log(data)
            currentEditor
              .chain()
              .insertContentAt(pos, {
                type: 'customImage',
                attrs: {
                  src: data.url,
                  'data-temp-id': data.tempId
                }
              })
              .focus()
              .run()
          })
        },
        onPaste: (currentEditor, files) => {
          files.forEach(file => {
            const fileReader = new FileReader()
            fileReader.onload = async () => {
              const data = await handleImageFile(file)
              if (!data) return
              currentEditor
                .chain()
                .insertContentAt(currentEditor.state.selection.anchor, {
                  type: 'customImage',
                  attrs: {
                    src: data.url,
                    'data-temp-id': data.tempId
                  }
                })
                .focus()
                .run()
              fileReader.readAsDataURL(file)
            }
          })

        }
      }),
      Mathematics.configure({
        inlineOptions: {
          onClick: (node, pos) => {
            modal.popup('Edit Math', 'Edit the math expression:', 'Update', node.attrs.latex).then((newMath) => {
              if (newMath) {
                editor.value.chain().setNodeSelection(pos).updateInlineMath({ latex: newMath }).focus().run()
              }
            })
          },
        },
        blockOptions: {
          onClick: (node, pos) => {
            modal.popup('Edit Math Block', 'Edit the math block:', 'Update', node.attrs.latex).then((newMath) => {
              if (newMath) {
                editor.value.chain().setNodeSelection(pos).updateBlockMath({ latex: newMath }).focus().run()
              }
            })
          },
        },
      }),
      Placeholder.configure({
        placeholder: 'Start typing...',
        emptyEditorClass: `first:before:content-[attr(data-placeholder)] first:before:text-gray-400 first:before:pointer-events-none first:before:h-[0] first:before:float-left`,
      }),
    ],
    onCreate: ({ editor: currentEditor }) => {
      // Migrate math strings to the new format
      migrateMathStrings(currentEditor)
    },
    content: '',
    onUpdate: ({ editor }) => {
/*       const html = editor.getHTML()
      const markdown = turndownService.turndown(html) */
      let json = editor.getJSON()
      emit('update:json', json)
      countImage.value = countImageInJSON(json)
    },
    editorProps: {

      attributes: {
        class: 'prose prose-sm max-w-none min-h-[200px] max-h-[400px] overflow-y-auto focus:outline-none',
      },
    },
  })
})

const getFinalJSONContent = async () => {
  const jsonContent = editor.value?.getJSON()

  if (!jsonContent || pendingImages.value.size === 0) {
    return jsonContent
  }

  // if there is no image in json but pendingImages is not empty, clear pendingImages
  if (countImageInJSON(jsonContent) === 0) {
    pendingImages.value.forEach((imageData) => {
      URL.revokeObjectURL(imageData.blobUrl)
    })
    pendingImages.value.clear()
    return jsonContent
  }

  try {
    // Upload all pending images matched with those in jsonContent
    const uploadPromises = []
    pendingImages.value.forEach((imageData, tempId) => {
      // Check if this image is in jsonContent
      let found = false
      const traverse = (node) => {
        if (node.type === 'customImage' && node.attrs['data-temp-id'] === tempId) {
          found = true
        }
        if (node.content && Array.isArray(node.content)) {
          node.content.forEach(child => traverse(child))
        }
      }
      traverse(jsonContent)
      if (found) {
        uploadPromises.push(
          actualImageUpload(imageData.file).then((uploadedData) => {
            return {
              tempId: tempId,
              uploadedUrl: uploadedData,
              blobUrl: imageData.blobUrl
            }
          })
        )
      } else {
        // If not found in JSON, revoke the blob URL
        URL.revokeObjectURL(imageData.blobUrl)
      }
    })

    const uploadResults = await Promise.all(uploadPromises)

    // Create a map for quick lookup
    const urlMap = new Map()
    uploadResults.forEach(({ tempId, uploadedUrl, blobUrl }) => {
      urlMap.set(tempId, uploadedUrl)
      urlMap.set(blobUrl, uploadedUrl)
    })

    // Recursively replace image URLs in JSON
    const replaceImageUrls = (node) => {
      if (node.type === 'customImage') {
        const tempId = node.attrs?.['data-temp-id']
        const blobUrl = node.attrs?.src
        node.type = 'image'

        // Replace with uploaded URL
        if (tempId && urlMap.has(tempId)) {
          node.attrs.src = urlMap.get(tempId).url
          delete node.attrs['data-temp-id'] // Remove temp ID
        } else if (blobUrl && urlMap.has(blobUrl)) {
          node.attrs.src = urlMap.get(blobUrl)
        }
      }

      // Recursively process children
      if (node.content && Array.isArray(node.content)) {
        node.content.forEach(child => replaceImageUrls(child))
      }

      return node
    }

    // Deep clone to avoid mutating original
    const finalContent = JSON.parse(JSON.stringify(jsonContent))
    replaceImageUrls(finalContent)

    // Clean up blob URLs
    uploadResults.forEach(({ blobUrl }) => {
      URL.revokeObjectURL(blobUrl)
    })

    pendingImages.value.clear()

    return finalContent

  } catch (error) {
    console.error('Error uploading images:', error)
    throw error
  }
}

const clearEditor = () => {
  editor.value?.commands.setContent('')

  pendingImages.value.forEach(({ blobUrl }) => {
    URL.revokeObjectURL(blobUrl)
  })
  pendingImages.value.clear()

  return true
}

defineExpose({
  getFinalJSONContent,
  clearEditor
})

onBeforeUnmount(() => {
  editor.value?.destroy()
})
</script>

<style>
@reference "../../assets/style.css";
/* Material Design 2 Button for Tailwind */
.md2-btn {
  @apply px-2 py-1 rounded-md bg-gray-50 hover:bg-gray-100 text-gray-700 transition-colors border border-gray-200 shadow-sm flex items-center justify-center;
}
.md2-btn-active {
  @apply bg-blue-100 text-blue-700 border-blue-300;
}
.prose {
  @apply text-gray-900;
}

.tiptap {
  :first-child {
    margin-top: 0;
  }

  img {
    display: block;
    height: auto;
    margin: 1.5rem 0;
    max-width: 100%;

    &.ProseMirror-selectednode {
      outline: 3px solid var(--purple);
    }
  }
}
</style>
