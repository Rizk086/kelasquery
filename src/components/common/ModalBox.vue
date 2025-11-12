<script setup>
import { defineEmits, defineProps, ref } from 'vue';
import { modal } from '../components';

const props = defineProps({
  modal: {
    title: {
      type: String,
      default: 'Modal Title',
    },
    content: {
      type: String,
      default: '',
    },
    input_value: {
      type: String,
      default: '',
    },
    confirmText: {
      type: String,
      default: 'Confirm',
    },
    visible: {
      type: Boolean,
      default: false,
    },
    inputBox: {
      type: Boolean,
      default: true,
    },
    confirmButton: {
      type: Boolean,
      default: 'Done',
    },
  },
});
const emit = defineEmits(['close', 'update']);

const inputValue = ref(props.modal.input_value);

function handleClose() {
  if (props.modal.inputBox)
    emit('update', inputValue.value);
  else
    emit('update', true)
  emit('close');
}
</script>

<template>
  <div
    class="fixed inset-0 z-50 grid place-content-center bg-black/50 p-4"
    role="dialog"
    aria-modal="true"
    aria-labelledby="modalTitle"
    @click.self="$emit('close')"
    v-if="modal.visible"
  >
    <div class="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
      <div class="flex items-start justify-between">
        <h2 id="modalTitle" class="text-xl font-bold text-gray-900 sm:text-2xl">
          {{ modal.title }}
        </h2>

        <button
          type="button"
          class="-me-4 -mt-4 rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-50 hover:text-gray-600 focus:outline-none"
          aria-label="Close"
          @click="$emit('close')"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="size-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <div class="mt-4">
        <p class="text-pretty text-gray-700 ">
          {{ modal.content }}
        </p>

        <label for="Confirm" class="mt-4 block" v-if="modal.inputBox">
          <span class="text-sm font-medium text-gray-700">
            {{ modal.confirmText }}
          </span>

          <input
            type="text"
            id="Confirm"
            class="mt-0.5 w-full rounded border font-normal p-1 border-gray-300 shadow-xs sm:text-sm"
            v-model="inputValue"
          />
        </label>
      </div>

      <footer class="mt-6 flex justify-end gap-2">
        <button
          type="button"
          @click="$emit('close')"
          class="rounded bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
        >
          Cancel
        </button>

        <button
          type="button"
          @click="handleClose"
          :disabled="modal.inputBox && !inputValue"
          :class="{ 'opacity-50 cursor-not-allowed': !inputValue && modal.inputBox }"
          aria-disabled="!inputValue"
          :aria-label="inputValue ? 'Confirm' : 'Confirm (disabled)'"
          class="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          {{ modal.confirmButton }}
        </button>
      </footer>
    </div>
  </div>
</template>
