<script setup lang="ts">
import { ref, computed, watch } from 'vue'

type Option = {
  id: number
  label: string
}

const props = defineProps<{
  options: Option[]
  modelValue: Option | null
  placeholder?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: Option | null): void
}>()

const isOpen = ref(false)
const search = ref('')

const filteredOptions = computed(() =>
  props.options.filter(o =>
    o.label.toLowerCase().includes(search.value.toLowerCase())
  )
)

function selectOption(option: Option) {
  emit('update:modelValue', option)
  isOpen.value = false
  search.value = ''
}

/* закриття при кліку поза компонентом */
function handleClickOutside(e: MouseEvent) {
  if (!(e.target as HTMLElement).closest('.search-select')) {
    isOpen.value = false
  }
}

watch(isOpen, open => {
  if (open) document.addEventListener('click', handleClickOutside)
  else document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div class="relative w-64 search-select">
    <!-- Selected -->
    <div
      class="border px-3 py-2 rounded cursor-pointer bg-white"
      @click.stop="isOpen = !isOpen"
    >
      {{ modelValue ? modelValue.label : placeholder || 'Оберіть' }}
    </div>

    <!-- Dropdown -->
    <div
      v-if="isOpen"
      class="absolute z-10 w-full bg-white border rounded mt-1 shadow"
    >
      <input
        v-model="search"
        type="text"
        placeholder="Пошук..."
        class="w-full px-2 py-1 border-b outline-none"
        @click.stop
      />

      <ul class="max-h-40 overflow-auto">
        <li
          v-for="option in filteredOptions"
          :key="option.id"
          class="px-3 py-2 hover:bg-gray-100 cursor-pointer"
          @click="selectOption(option)"
        >
          {{ option.label }}
        </li>

        <li
          v-if="filteredOptions.length === 0"
          class="px-3 py-2 text-gray-400"
        >
          Нічого не знайдено
        </li>
      </ul>
    </div>
  </div>
</template>
