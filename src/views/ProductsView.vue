<script setup lang="ts">
import { ref, computed } from 'vue'

type Product = {
    id: number
    code: string
    name: string
    quantity: number
    category: string
    price: number
}

/* 🔹 Мокові дані */
const products = ref<Product[]>([
    { id: 1, code: 'A001', name: 'Монітор', quantity: 10, category: 'Техніка', price: 4500 },
    { id: 2, code: 'B002', name: 'Клавіатура', quantity: 25, category: 'Аксесуари', price: 900 },
    { id: 3, code: 'C003', name: 'Миша', quantity: 40, category: 'Аксесуари', price: 500 }
])

/* 🔹 Пошук */
const search = ref('')

/* 🔹 Сортування */
const sortKey = ref<keyof Product | null>(null)
const sortAsc = ref(true)

function sortBy(key: keyof Product) {
    if (sortKey.value === key) {
        sortAsc.value = !sortAsc.value
    } else {
        sortKey.value = key
        sortAsc.value = true
    }
}

/* 🔹 Обчислені дані */
const filteredProducts = computed(() => {
    let data = products.value.filter(p =>
        p.name.toLowerCase().includes(search.value.toLowerCase()) ||
        p.code.toLowerCase().includes(search.value.toLowerCase())
    )

    if (sortKey.value) {
        data = [...data].sort((a, b) => {
            const aVal = a[sortKey.value!]
            const bVal = b[sortKey.value!]

            if (aVal < bVal) return sortAsc.value ? -1 : 1
            if (aVal > bVal) return sortAsc.value ? 1 : -1
            return 0
        })
    }

    return data
})

/* 🔹 Resize колонок */
function startResize(e: PointerEvent, th: HTMLElement) {
  const startX = e.clientX
  const startWidth = th.offsetWidth

  const onMove = (ev: PointerEvent) => {
    th.style.width = startWidth + (ev.clientX - startX) + 'px'
  }

  const onUp = () => {
    document.removeEventListener('pointermove', onMove)
    document.removeEventListener('pointerup', onUp)
  }

  document.addEventListener('pointermove', onMove)
  document.addEventListener('pointerup', onUp)
}


</script>

<template>
    <div>
        <h1 class="text-xl font-bold mb-4">Товари</h1>

        <div class="mb-4 flex gap-2">
            <input v-model="search" type="text" placeholder="Пошук товарів..." class="border px-2 py-1 rounded w-64" />
        </div>

        <table class="w-full border-collapse">
            <thead>
                <tr class="bg-gray-200">
                    <th class="th">№</th>

                    <th class="th" @click="sortBy('code')">
                        Код товару
                        <span>⇅</span>
                        <div class="resizer" @pointerdown="(e) => startResize(e, e.currentTarget.parentElement as HTMLElement)"></div>
                    </th>

                    <th class="th" @click="sortBy('name')">
                        Назва
                        <span>⇅</span>
                        <div class="resizer" @pointerdown="(e) => startResize(e, e.currentTarget.parentElement as HTMLElement)"></div>
                    </th>

                    <th class="th" @click="sortBy('quantity')">
                        Кількість
                        <span>⇅</span>
                        <div class="resizer" @pointerdown="(e) => startResize(e, e.currentTarget.parentElement as HTMLElement)"></div>
                    </th>

                    <th class="th" @click="sortBy('category')">
                        Категорія
                        <span>⇅</span>
                        <div class="resizer" @pointerdown="(e) => startResize(e, e.currentTarget.parentElement as HTMLElement)"></div>
                    </th>

                    <th class="th" @click="sortBy('price')">
                        Ціна
                        <span>⇅</span>
                        <div class="resizer" @pointerdown="(e) => startResize(e, e.currentTarget.parentElement as HTMLElement)"></div>
                    </th>

                    <th class="th">Дії</th>
                </tr>
            </thead>

            <tbody>
                <tr v-for="(p, index) in filteredProducts" :key="p.id" class="border-b">
                    <td class="td">{{ index + 1 }}</td>
                    <td class="td">{{ p.code }}</td>
                    <td class="td">{{ p.name }}</td>
                    <td class="td">{{ p.quantity }}</td>
                    <td class="td">{{ p.category }}</td>
                    <td class="td">{{ p.price }} ₴</td>
                    <td class="td w-57">
                        <div class="flex gap-2 items-center">
                            <button class="w-full bg-blue-600 text-white px-2 py-1 rounded">Редагувати</button>
                            <button class="w-full bg-red-600 text-white px-2 py-1 rounded">Видалити</button>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<style scoped>
.th {
    position: relative;
    padding: 8px 12px;
    border: 1px solid #ccc;
    user-select: none;
    white-space: nowrap;
}

.td {
    padding: 6px 12px;
    border: 1px solid #ddd;
}

.resizer {
  position: absolute;
  right: 0;
  top: 0;
  width: 6px;
  height: 100%;
  cursor: col-resize;
  touch-action: none;
}
</style>
