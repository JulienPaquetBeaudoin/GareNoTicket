<script setup>
import { RouterView } from 'vue-router'
import NavBar from './components/NavBar.vue'
</script>

<template>
    <header>
        <NavBar />
    </header>
    <RouterView />
    <footer class="bg-rose-100 p-5 flex justify-center text-white font-bold">
        <p class="border-2 rounded-md bg-rose-600 px-[7px] py-[10px]">Julien Paquet-Beaudoin</p>
    </footer>
</template>

<style>
body {
    background-color: rgb(255 241 242);
}
</style>
