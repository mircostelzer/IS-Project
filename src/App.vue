<script setup>
import { RouterLink, RouterView } from "vue-router";
</script>

<template>
    <div class="flex flex-col justify-center items-center w-full h-48 my-12">
        <h1 class="text-5xl">Ocio</h1>
        <br>
        <nav class="text-primary">
            <RouterLink to="/">Home</RouterLink>
            <br>
            <RouterLink to="/emergenze">Emergenze</RouterLink>
        </nav>
    </div>
    <RouterView />
</template>

<style scoped>
</style>
