<template>
    <header class="bg-blue-500 h-20 w-full flex justify-between items-center px-10">
        <h1 class="text-white text-2xl font-bold">STOCKER</h1>
        <div>
            <nav class="text-white flex gap-12">
                <router-link to="/products" class="text-lg hover:scale-110 transition">Товари</router-link>
                <!-- <router-link to="/income">Прихід</router-link>
                <router-link to="/sale">Продаж</router-link> -->
                <router-link to="/operation" class="text-lg hover:scale-110 transition">Операції</router-link>
                <router-link to="/history" class="text-lg hover:scale-110 transition">Історія</router-link>
            </nav>
        </div>
    </header>
</template>