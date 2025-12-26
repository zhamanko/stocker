<script setup lang="ts">
import { ref, computed } from 'vue'

type HistoryItem = {
    id: number
    date: string
    type: 'income' | 'sale'
    products: {
        code: string
        name: string
        category: string
        quantity: number
        price_unit: number
    }[],
    comentary: string | null
}

const typeActive = ref<'all' | 'income' | 'sale'>('all')

const search = ref<string>('')

const dateFrom = ref<string | null>(null)
const dateTo = ref<string | null>(null)

function parseDate(dateStr: string): Date {
    const [day, month, year] = dateStr.split('.')
    return new Date(+year, +month - 1, +day)
}


const history = ref<HistoryItem[]>([
    {
        id: 1,
        date: '12.12.2025',
        type: 'sale',
        products: [
            { code: 'A001', name: 'Монітор', category: 'Електроніка', quantity: 4, price_unit: 20 },
            { code: 'B002', name: 'Клавіатура', category: 'Електроніка', quantity: 1, price_unit: 10 }
        ],
        comentary: 'Термінова доставка'
    },
    {
        id: 2,
        date: '12.12.2025',
        type: 'income',
        products: [
            { code: 'C003', name: 'Миша', category: 'Електроніка', quantity: 5, price_unit: 5 }
        ],
        comentary: null
    },
    {
        id: 3,
        date: '11.12.2025',
        type: 'sale',
        products: [
            { code: 'B002', name: 'Клавіатура', category: 'Електроніка', quantity: 2, price_unit: 10 }
        ],
        comentary: 'Клієнт забрав самовивозом'
    }
])

const filteredHistory = computed(() => {
    return history.value.filter(check => {
        /* 🔹 Фільтр по типу */
        if (typeActive.value !== 'all' && check.type !== typeActive.value) {
            return false
        }

        /* 🔹 Фільтр по датах */
        const checkDate = parseDate(check.date)

        if (dateFrom.value) {
            const from = new Date(dateFrom.value)
            from.setHours(0, 0, 0, 0)
            if (checkDate < from) return false
        }

        if (dateTo.value) {
            const to = new Date(dateTo.value)
            to.setHours(23, 59, 59, 999)
            if (checkDate > to) return false
        }

        /* 🔹 Пошук */
        if (!search.value.trim()) return true

        const q = search.value.toLowerCase()

        return (
            check.products.some(p =>
                p.code.toLowerCase().includes(q) ||
                p.name.toLowerCase().includes(q)
            ) ||
            check.comentary?.toLowerCase().includes(q)
        )
    })
})


</script>

<template>
    <div>
        <h1 class="text-2xl font-bold mb-4">Історія</h1>

        <!-- Пошук -->
        <div class="mb-4 flex gap-2 justify-between">
            <div class="space-x-4">
                <button class="bg-blue-400 text-white px-6 py-1 rounded cursor-pointer hover:bg-blue-500 transition"
                    :class="typeActive === 'all' ? 'bg-blue-600' : ''" @click="typeActive = 'all'">
                    Все
                </button>

                <button class="bg-blue-400 text-white px-6 py-1 rounded cursor-pointer hover:bg-blue-500 transition"
                    :class="typeActive === 'income' ? 'bg-blue-600' : ''" @click="typeActive = 'income'">
                    Приходи
                </button>

                <button class="bg-blue-400 text-white px-6 py-1 rounded cursor-pointer hover:bg-blue-500 transition"
                    :class="typeActive === 'sale' ? 'bg-blue-600' : ''" @click="typeActive = 'sale'">
                    Продажі
                </button>
            </div>
            <div class="flex gap-3 items-center">
                <input type="date" v-model="dateFrom" class="border px-2 py-1 rounded" />
                <span>—</span>
                <input type="date" v-model="dateTo" class="border px-2 py-1 rounded" />
            </div>
            <input v-model="search" type="text" placeholder="Пошук(назва або код)..."
                class="border px-2 py-1 rounded w-124" />
        </div>

        <div>
            <div class="flex flex-col gap-4">
                <div v-for="check in filteredHistory" :key="check.id" class="rounded-2xl p-4 shadow"
                    :class="check.type === 'income' ? 'bg-blue-100' : 'bg-green-100'">
                    <div class="flex justify-between mb-2">
                        <h2 class="font-bold text-xl">
                            {{ check.type === 'income' ? 'Прихід' : 'Продаж' }}
                        </h2>
                        <span>{{ check.date }}</span>
                    </div>

                    <table class="w-full border-collapse mb-2">
                        <thead>
                            <tr>
                                <th class="border px-2 py-1">Код</th>
                                <th class="border px-2 py-1">Назва</th>
                                <th class="border px-2 py-1">Категорія</th>
                                <th class="border px-2 py-1 w-32">Кількість</th>
                                <th class="border px-2 py-1 w-32">Ціна за один.</th>
                                <th class="border px-2 py-1 w-32">Разом</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="prod in check.products" :key="prod.code">
                                <td class="border px-2 py-1">{{ prod.code }}</td>
                                <td class="border px-2 py-1">{{ prod.name }}</td>
                                <td class="border px-2 py-1">{{ prod.category || '—' }}</td>
                                <td class="border px-2 py-1">{{ prod.quantity }}</td>
                                <td class="border px-2 py-1">{{ prod.price_unit }} $</td>
                                <td class="border px-2 py-1">{{ prod.quantity * prod.price_unit }} $</td>
                            </tr>
                        </tbody>
                    </table>
                    <div :class="check.comentary ? 'mt-2' : 'hidden'">
                        <strong>Коментар:</strong>
                        <span class="ml-2">{{ check.comentary }}</span>
                    </div>

                    <div class="text-right font-bold">
                        Разом: {{ check.products.reduce((sum, p) => sum + p.quantity * p.price_unit, 0) }} $
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>
