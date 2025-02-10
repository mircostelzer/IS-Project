<script setup>
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { emergency, getEmergencyById } from '../data/emergencies'

import { MagnifyingGlassIcon, ArrowUturnLeftIcon } from "@heroicons/vue/24/solid"
import BadgeCategoria from '@/components/Badge/BadgeCategoria.vue'
import BadgeStato from '@/components/Badge/BadgeStato.vue'
import WrongURL from '@/components/Error/WrongURL.vue'

const route = useRoute()
const router = useRouter()

// Funzione per gestire la descrizione dell'emergenza
const conDescrizione = (descrizione) => {
    return descrizione ? descrizione : '<i>Nessuna descrizione disponibile</i>';
};

onMounted(() => {
    getEmergencyById(route.query.id)
});
</script>

<template>
    <div v-if="emergency === null">
        <WrongURL />
    </div>

    <div v-else class="div-principale w-full flex justify-center">
        <div class="max-w-7xl h-full">
            <div class="flex flex-row items-center mt-4 md:mt-0 mb-8">
                <MagnifyingGlassIcon class="w-6 h-6 md:w-8 md:h-8 me-3" />
                <h1 class="text-xl md:text-2xl text-white font-bold">Dettagli emergenza</h1>
            </div>
            
            <div class="div-risultato w-full px-8 py-8 mb-2 md:mb-4 rounded-2xl">
                <p class="font-bold text-3xl text-white mb-2">{{ emergency.title }}</p>
                <p class="text-gray-300 mb-6" v-html="conDescrizione(emergency.description)"></p>
                <div class="columns-1 md:columns-2">
                    <div class="pe-6">
                        <p class="text-slate-100 font-bold">Categoria: </p>
                        <BadgeCategoria :category="emergency.category" />
                    </div>
                    <div class="pe-6 mt-6">
                        <p class="text-slate-100 font-bold">Area interessata: </p>
                        <p class="text-gray-300">{{ emergency.location }}</p>
                    </div>
                    <div class="pe-6 mt-6">
                        <p class="text-slate-100 font-bold">Stato: </p>
                        <BadgeStato :state="emergency.state" />
                    </div>
                    <div class="pe-6 mt-6">
                        <p class="text-slate-100 font-bold">Data segnalazione: </p>
                        <p class="text-gray-300">{{ emergency.startDate }}</p>
                    </div>
                </div>
                <button @click="router.go(-1)" class="btn btn-secondary btn-block mt-6">
                    <ArrowUturnLeftIcon class="w-5 h-5" />Torna indietro
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.div-principale {
    padding: min(50px, 3vw);
}

.div-risultato {
    background-color: #415d3b;
}
</style>
