<script setup>
import { KeyIcon } from "@heroicons/vue/24/solid";
</script>

<template>
    <div class="to-center max-height w-full">
        <div class="div-404 flex flex-col justify-center text-center p-8">
            <p class="text-6xl">401</p>
            <p class="text-lg font-bold mb-4">Contenuto limitato!</p>
            <p class="text-md text-gray-300 mb-8">Per visualizzare questo contenuto, <b>devi prima effettuare l'accesso</b></p>
            <RouterLink to="/accedi?limited=true">
                <button class="btn btn-primary">
                    <KeyIcon class="w-5 h-5 p-0 mb-0.5" />Effettua l'accesso
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
