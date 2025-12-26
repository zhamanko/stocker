<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ProductService, Product } from './../services/product.service'
import { f } from 'vue-router/dist/router-CWoNjPRp.mjs'

const products = ref<Product[]>([])
const isModalOpen = ref(false)
const editId = ref<number | null>(null)

const form = ref<Omit<Product, 'id'>>({
    code: '',
    name: '',
    quantity: 0,
    category: '',
    price: 0
})

const search = ref('')
const sortKey = ref<keyof Product | null>(null)
const sortAsc = ref(true)

// Завантаження продуктів з бази
async function loadProducts() {
    products.value = await ProductService.getAll()
}

onMounted(loadProducts)

// Сортування
function sortBy(key: keyof Product) {
    if (sortKey.value === key) {
        sortAsc.value = !sortAsc.value
    } else {
        sortKey.value = key
        sortAsc.value = true
    }
}

// Фільтрація
const filteredProducts = computed(() => {
    let data = products.value.filter(p =>
        p.name.toLowerCase().includes(search.value.toLowerCase()) ||
        p.code.toLowerCase().includes(search.value.toLowerCase()) ||
        p.category.toLowerCase().includes(search.value.toLowerCase())
    )

    if (sortKey.value) {
        data = [...data].sort((a, b) => {
            const aVal = a[sortKey.value!]
            const bVal = b[sortKey.value!]
            if (aVal === undefined || bVal === undefined) return 0
            if (aVal < bVal) return sortAsc.value ? -1 : 1
            if (aVal > bVal) return sortAsc.value ? 1 : -1
            return 0
        })
    }

    return data
})

// Resize колонок
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

// Модалка
function openAddModal() {
    editId.value = null
    form.value = {
        code: '',
        name: '',
        quantity: 0,
        category: '',
        price: 0
    }
    isModalOpen.value = true
}

function openEditModal(product: Product) {
    editId.value = product.id
    form.value = { ...product }
    isModalOpen.value = true
}

function closeModal() {
    isModalOpen.value = false
}

async function saveProduct() {
    if (!form.value.code || !form.value.name) return

    if (editId.value === null) {
        const product: Product = { ...form.value, id: Date.now() }
        console.log('Creating product', product)
        await ProductService.create(product)
    } else {
        await ProductService.update({ id: editId.value, ...form.value })
    }

    closeModal()
    await loadProducts()
}

async function deleteProduct(id: number) {
    if (!confirm('Видалити товар?')) return
    await ProductService.delete(id)
    await loadProducts()
}

</script>

<template>
    <div>
        <h1 class="text-2xl font-bold mb-4">Товари</h1>

        <div class="mb-4 flex gap-2 justify-between">
            <div>
                <button class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 cursor-pointer transition"
                    @click="openAddModal">
                    Додати товар
                </button>

            </div>
            <input v-model="search" type="text" placeholder="Пошук товарів(назва або код)..."
                class="border px-2 py-1 rounded w-1/4" />
        </div>

        <table class="w-full border-collapse">
            <thead>
                <tr class="bg-gray-200">
                    <th class="th rounded-tl-xl" @click="sortBy('id')">
                        №
                        <span>⇅</span>
                        <div class="resizer" @pointerdown="(e) => {
                            if (e.currentTarget) {
                                const target = e.currentTarget as HTMLElement;
                                startResize(e, target.parentElement as HTMLElement);
                            }
                        }"></div>
                    </th>

                    <th class="th" @click="sortBy('code')">
                        Код товару
                        <span>⇅</span>
                        <div class="resizer" @pointerdown="(e) => {
                            if (e.currentTarget) {
                                const target = e.currentTarget as HTMLElement;
                                startResize(e, target.parentElement as HTMLElement);
                            }
                        }"></div>
                    </th>

                    <th class="th" @click="sortBy('name')">
                        Назва
                        <span>⇅</span>
                        <div class="resizer" @pointerdown="(e) => {
                            if (e.currentTarget) {
                                const target = e.currentTarget as HTMLElement;
                                startResize(e, target.parentElement as HTMLElement);
                            }
                        }"></div>
                    </th>

                    <th class="th w-45" @click="sortBy('quantity')">
                        Кількість
                        <span>⇅</span>
                        <div class="resizer" @pointerdown="(e) => {
                            if (e.currentTarget) {
                                const target = e.currentTarget as HTMLElement;
                                startResize(e, target.parentElement as HTMLElement);
                            }
                        }"></div>
                    </th>

                    <th class="th" @click="sortBy('category')">
                        Категорія
                        <span>⇅</span>
                        <div class="resizer" @pointerdown="(e) => {
                            if (e.currentTarget) {
                                const target = e.currentTarget as HTMLElement;
                                startResize(e, target.parentElement as HTMLElement);
                            }
                        }"></div>
                    </th>

                    <th class="th w-30" @click="sortBy('price')">
                        Ціна за один.
                        <span>⇅</span>
                        <div class="resizer" @pointerdown="(e) => {
                            if (e.currentTarget) {
                                const target = e.currentTarget as HTMLElement;
                                startResize(e, target.parentElement as HTMLElement);
                            }
                        }"></div>
                    </th>

                    <th class="th rounded-tr-xl">Дії</th>
                </tr>
            </thead>

            <tbody>
                <tr v-for="(p) in filteredProducts" :key="p.id" class="border-b">
                    <td class="td">{{ p.id }}</td>
                    <td class="td">{{ p.code }}</td>
                    <td class="td">{{ p.name }}</td>
                    <td class="td">{{ p.quantity }}</td>
                    <td class="td">{{ p.category }}</td>
                    <td class="td">{{ p.price }} $</td>
                    <td class="td w-57">
                        <div class="flex gap-2 items-center">
                            <button
                                class="w-full bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 cursor-pointer transition"
                                @click="openEditModal(p)">
                                Редагувати
                            </button>

                            <button
                                class="w-full bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 cursor-pointer transition"
                                @click="deleteProduct(p.id)">
                                Видалити
                            </button>

                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>

    <div v-if="isModalOpen" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div class="bg-white rounded-2xl p-6 ">
            <h1 class="text-2xl font-bold mb-4">
                {{ editId ? 'Редагувати товар' : 'Додати товар' }}
            </h1>

            <div class="flex gap-4 mb-6">
                <div class="flex flex-col">
                    <label>Код товару:</label>
                    <input v-model="form.code" class="border border-solid-black py-1 px-2 rounded" />
                </div>

                <div class="flex flex-col">
                    <label>Назва:</label>
                    <input v-model="form.name" class="border border-solid-black py-1 px-2 rounded" />
                </div>

                <div class="flex flex-col">
                    <label>Кількість:</label>
                    <input v-model.number="form.quantity" type="number"
                        class="border border-solid-black py-1 px-2 rounded" />
                </div>

                <div class="flex flex-col">
                    <label>Категорія:</label>
                    <input v-model="form.category" class="border border-solid-black py-1 px-2 rounded" />
                </div>

                <div class="flex flex-col">
                    <label>Ціна за один.:</label>
                    <input v-model.number="form.price" type="number"
                        class="border border-solid-black py-1 px-2 rounded" />
                </div>
            </div>

            <div class="flex justify-end gap-3">
                <button class="px-4 py-2 rounded border hover:bg-gray-100 cursor-pointer transition"
                    @click="closeModal">
                    Скасувати
                </button>
                <button class="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 cursor-pointer transition"
                    @click="saveProduct">
                    Зберегти
                </button>
            </div>
        </div>
    </div>

</template>

<style scoped>
.th {
    position: relative;
    padding: 8px 12px;
    border: 1px solid #ccc;
    user-select: none;
    white-space: nowrap;
    cursor: pointer;
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
