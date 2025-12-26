<script setup lang="ts">
import { ref } from 'vue'
import SearchSelect from './../components/SearchSelect.vue'

const operationDate = ref(new Date().toISOString().substr(0, 10))

type ProductOption = {
    id: number
    label: string
}

type OperationRow = {
    id: number
    product: ProductOption | null
    quantity: number | null
    price: number | null
}

const products: ProductOption[] = [
    { id: 1, label: 'A001 — Монітор' },
    { id: 2, label: 'B002 — Клавіатура' },
    { id: 3, label: 'C003 — Миша' }
]

const operationType = ref<'income' | 'sale'>('income')

const rows = ref<OperationRow[]>([
    { id: 1, product: null, quantity: null, price: null }
])

function addRow() {
    rows.value.push({
        id: Date.now(),
        product: null,
        quantity: null,
        price: null
    })
}

function removeRow(id: number) {
    rows.value = rows.value.filter(r => r.id !== id)
}

function submitOperation() {
    const payload = {
        type: operationType.value,
        date: operationDate.value,
        items: rows.value
    }

    console.log('Операція:', payload)
    // 🔜 тут буде виклик Electron API → SQLite
}
</script>


<template>
    <h1 class="text-2xl font-bold mb-4">Операції</h1>

    <!-- Тип + дата -->
    <div class="flex gap-8 mb-5">
        <div class="space-x-2">
            <label>Тип операції:</label>
            <select v-model="operationType" class="border border-solid-black rounded px-2 py-1">
                <option value="income">Прихід</option>
                <option value="sale">Продаж</option>
            </select>
        </div>

        <div class="space-x-2">
            <label>Дата операції:</label>
            <input v-model="operationDate" type="date" class="border border-solid-black rounded px-2 py-1" />
        </div>

        <div class="space-x-2 flex-1">
            <label>Коментар:</label>
            <input type="text" class="w-3/4 border border-solid-black rounded px-2 py-1"/>
        </div>
    </div>

    <!-- Таблиця позицій -->
    <table class="w-full border-collapse">
        <thead class="bg-gray-300">
            <tr>
                <th class="py-3 rounded-tl-xl w-12">№</th>
                <th class="py-3">Товар</th>
                <th class="py-3 w-32">Кількість</th>
                <th class="py-3 w-32">Ціна за один.</th>
                <th class="py-3 rounded-tr-xl w-16"></th>
            </tr>
        </thead>

        <tbody>
            <tr v-for="(row, index) in rows" :key="row.id" class="border-b border-solid-black">
                <td class="p-2 text-center">{{ index + 1 }}</td>

                <td class="p-2">
                    <SearchSelect v-model="row.product" :options="products" placeholder="Оберіть товар"
                        class="w-full" />
                </td>

                <td class="p-2">
                    <input v-model.number="row.quantity" type="number" min="1"
                        class="border border-solid-black rounded px-1 py-2 w-full" />
                </td>

                <th>
                    <input v-model.number="row.price" type="number" min="0" step="0.01"
                        class="border border-solid-black rounded px-1 py-2 w-full" />
                </th>

                <td class="p-2 text-center">
                    <button class="text-red-600 cursor-pointer hover:scale-180 transition" v-if="rows.length > 1" @click="removeRow(row.id)">
                        ✖
                    </button>
                </td>
            </tr>
        </tbody>
    </table>

    <!-- Додати позицію -->
    <div class="flex justify-center">
        <button class="bg-blue-500 text-white py-1 px-4 rounded mt-5 hover:bg-blue-600 cursor-pointer transition" @click="addRow">
            Додати позицію
        </button>
    </div>

    <!-- Виконати -->
    <div class="flex justify-end mt-6">
        <button class="bg-green-500 text-white py-2 px-6 rounded hover:bg-green-600 cursor-pointer transition" @click="submitOperation">
            Виконати операцію
        </button>
    </div>
</template>
