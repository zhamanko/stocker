<script setup lang="ts">
import { ref, computed } from 'vue'
type HistoryItem = {
    id: number
    date: string
    type: 'income' | 'sale'
    products: {
        code: string
        name: string
        quantity: number
        price: number
    }[]
}

const history = ref<HistoryItem[]>([
    {
        id: 1,
        date: '12.12.2025',
        type: 'sale',
        products: [
            { code: 'A001', name: 'Монітор', quantity: 4, price: 4500 },
            { code: 'B002', name: 'Клавіатура', quantity: 1, price: 900 }
        ]
    },
    {
        id: 2,
        date: '12.12.2025',
        type: 'income',
        products: [
            { code: 'C003', name: 'Миша', quantity: 5, price: 500 }
        ]
    },
    {
        id: 3,
        date: '11.12.2025',
        type: 'sale',
        products: [
            { code: 'B002', name: 'Клавіатура', quantity: 2, price: 900 }
        ]
    }
])

</script>

<template>
    <div>
        <h1 class="text-2xl font-bold mb-4">Історія</h1>

        <!-- Пошук -->
        <div class="mb-4 flex gap-2 justify-between">
            <div class="space-x-4">
                <button class="bg-blue-400 text-white px-6 py-1 rounded">Все</button>
                <button class="bg-blue-400 text-white px-6 py-1 rounded">Приходи</button>
                <button class="bg-blue-400 text-white px-6 py-1 rounded">Продажі</button>
            </div>
            <input v-model="search" type="text" placeholder="Пошук..." class="border px-2 py-1 rounded w-124" />
        </div>

        <div>
            <div class="flex flex-col gap-4">
                <div v-for="check in history" :key="check.id" class="rounded-2xl p-4 shadow"
                    :class="check.type === 'income' ? 'bg-blue-100' : 'bg-green-100'">
                    <div class="flex justify-between mb-2">
                        <h2 class="font-bold">
                            {{ check.type === 'income' ? 'Прихід' : 'Продаж' }}
                        </h2>
                        <span class="text-sm">{{ check.date }}</span>
                    </div>

                    <table class="w-full border-collapse mb-2">
                        <thead>
                            <tr>
                                <th class="border px-2 py-1">Код</th>
                                <th class="border px-2 py-1">Назва</th>
                                <th class="border px-2 py-1">Кількість</th>
                                <th class="border px-2 py-1">Ціна</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="prod in check.products" :key="prod.code">
                                <td class="border px-2 py-1">{{ prod.code }}</td>
                                <td class="border px-2 py-1">{{ prod.name }}</td>
                                <td class="border px-2 py-1">{{ prod.quantity }}</td>
                                <td class="border px-2 py-1">{{ prod.price }} ₴</td>
                            </tr>
                        </tbody>
                    </table>

                    <div class="text-right font-bold">
                        Разом: {{check.products.reduce((sum, p) => sum + p.quantity * p.price, 0)}} ₴
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>
