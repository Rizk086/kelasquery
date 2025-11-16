<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { Editor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import ImageNode from '@tiptap/extension-image'
import { Mathematics, migrateMathStrings } from '@tiptap/extension-mathematics'
import Placeholder from '@tiptap/extension-placeholder'
import { createLowlight, common } from 'lowlight'
import js from 'highlight.js/lib/languages/javascript'
import css from 'highlight.js/lib/languages/css'
import html from 'highlight.js/lib/languages/xml'
import 'highlight.js/styles/atom-one-dark.css'
import 'katex/dist/katex.min.css'

const props = defineProps({
  content: {
    type: Object,
    required: true
  }
})

const readonly_editor = ref(null)
const lowlight = createLowlight(common)
lowlight.register({ js })
lowlight.register({ css })
lowlight.register({ html })

onMounted(() => {
  readonly_editor.value = new Editor({
    content: props.content,
    extensions: [
      StarterKit.configure({
        lowlight
      }),
      CodeBlockLowlight.configure({ lowlight }),
      ImageNode,
      Mathematics,
      Placeholder.configure({
        placeholder: 'Type something...',
        emptyNodeClass: 'is-empty',
      }),
    ],
    onCreate: ({ editor: currentEditor}) => {
      migrateMathStrings(currentEditor)
    },
    editable: false,
    editorProps: {
      attributes: {
        class: 'w-full prose',
      },
    },
  })
})

onBeforeUnmount(() => {
  if (readonly_editor.value) {
    readonly_editor.value.destroy()
  }
})
</script>

<template>
  <EditorContent
    class="w-full prose prose-sm min-h-[200px] overflow-y-auto focus:outline-none"
   :editor="readonly_editor" />
</template>

<style>
/* Basic editor styles */
.tiptap {
  :first-child {
    margin-top: 0;
  }

  /* Mathematics extension styles */
  .tiptap-mathematics-render {
    padding: 0 0.25rem;

    &--editable {
      cursor: pointer;
      transition: background 0.2s;

      &:hover {
        background: #eee;
      }
    }
  }

  .tiptap-mathematics-render {
    border-radius: 0.25rem;

    &[data-type='inline-math'] {
      display: inline-block;
    }

    &[data-type='block-math'] {
      display: block;
      margin: 1rem 0;
      padding: 1rem;
      text-align: center;
    }

    &.inline-math-error,
    &.block-math-error {
      background: var(--red-light);
      color: var(--red);
      border: 1px solid var(--red-dark);
      padding: 0.5rem;
      border-radius: 0.25rem;
    }
  }
}
</style>
