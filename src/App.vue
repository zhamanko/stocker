<script setup lang="ts">
  import Header from './components/Header.vue'
  import { RouterView } from 'vue-router'
</script>

<template>
  <Header />
  <main class="mx-6 my-4">
      <router-view />
  </main>
</template>