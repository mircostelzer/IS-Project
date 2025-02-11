<script setup>
import { HomeIcon } from "@heroicons/vue/24/solid";
</script>

<template>
    <div class="to-center max-height w-full">
        <div class="div-404 flex flex-col justify-center text-center">
            <p class="text-6xl">400</p>
            <p class="text-lg font-bold mb-4">Contenuto non esistente!</p>
            <p class="text-md text-gray-300 mb-8">Uno o più parametri forniti non sono corretti</p>
            <RouterLink to="/">
                <button class="btn btn-primary">
                    <HomeIcon class="w-5 h-5 p-0 mb-0.5" />Ritorna alla home
                </button>
            </RouterLink>
        </div>
    </div>
</template>

<style scoped>
.div-404 {
    width: min(400px, 100%);
    height: min(300px, 100%);
    margin: 10px;
    border-radius: 10px;
    
    background-color: #23351f80;
}
</style>
