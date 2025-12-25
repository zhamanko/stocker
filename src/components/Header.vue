<template>
    <header class="bg-gray-500 h-20 w-full flex justify-between items-center px-10">
        <h1 class="text-white text-lg">STOCKER</h1>
        <div>
            <nav class="text-white flex gap-12">
                <router-link to="/products">Товари</router-link>
                <!-- <router-link to="/income">Прихід</router-link>
                <router-link to="/sale">Продаж</router-link> -->
                <router-link to="/operation">Операції</router-link>
                <router-link to="/history">Історія</router-link>
            </nav>
        </div>
    </header>
</template>