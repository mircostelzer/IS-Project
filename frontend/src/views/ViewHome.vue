<script setup>
import { onMounted } from 'vue'
import { emergencies, emergenciesInProgress, getEmergenciesInProgress } from '../data/emergencies'
import { ArrowsPointingOutIcon } from "@heroicons/vue/24/solid"

import Mappa from "../components/Mappa/Mappa.vue"
import BadgeCategoria from '@/components/Badge/BadgeCategoria.vue'
import { loadUserFromCookies } from '@/states/loggedUser'

// Ottengo l'ora attuale
const oraUltimoAggiornamento = new Date().toLocaleString('it-IT', {
    hour: '2-digit',
    minute: '2-digit'
});

onMounted(() => {
    getEmergenciesInProgress()
})
</script>

<template>
    <div class="max-height flex flex-col lg:flex-row">
        <div class="div-emergenze h-2/5 lg:h-full w-full lg:max-w-xl p-6">
            <h1 class="text-2xl font-semibold my-2">&#128680 Emergenze in corso</h1>
            <p class="text-md font-light mb-8">
                Ultimo aggiornamento: <span class="text-gray-300">{{ oraUltimoAggiornamento }}</span>
            </p>

            <div v-if="emergenciesInProgress.length === 0" class="div-risultati w-full h-auto">
                <p class="text-gray-300"><i>Nessuna emergenza in corso...</i></p>
            </div>
            <transition-group v-else name="fade" tag="div">
                <div v-for="(emergency, index) in emergenciesInProgress" :key="emergency.id"
                    class="collapse-emergenza collapse collapse-arrow mt-2 fade-in"
                    :style="{ animationDelay: `${index * 0.05}s` }">
                    <input type="radio" name="lista-emergenze" />
                    <div class="collapse-title text-xl font-medium text-white">{{ emergency.title }}</div>
                    <div class="collapse-content">
                        <p class="text-sm text-gray-300 -mt-4 mb-4">{{ emergency.location }}</p>
                        <div class="columns-2">
                            <div>
                                <p class="text-slate-100">Categoria: </p>
                                <BadgeCategoria :category="emergency.category" class="badge-warning badge-sm" />
                            </div>
                            <div>
                                <p class="text-slate-100">Data pubblicazione: </p>
                                <p class="text-gray-300 text-sm">{{ emergency.startDate }}</p>
                            </div>
                        </div>
                        <router-link :to="`/dettagli?id=${emergency.id}`">
                            <button class="btn btn-secondary btn-sm float-end mt-3">
                                <ArrowsPointingOutIcon class="w-4 h-4 opacity-80 -mx-0.5 mb-0.5" />
                                Espandi
                            </button>
                        </router-link>
                    </div>
                </div>
            </transition-group>
        </div>

        <Mappa :emergencies="emergenciesInProgress" />
    </div>
</template>

<style scoped>
.div-emergenze {
    overflow-y: scroll;
}

.collapse-emergenza {
    background-color: #555e53;
    transition: background-color 0.3s ease-out, translate 0.3s ease-out;
}

.collapse-emergenza:hover,
.collapse-emergenza:focus,
.collapse-emergenza:focus-visible,
.collapse-emergenza:focus-within {
    background-color: #405f39;
    translate: 5px 0px;
}

.fade-in {
    opacity: 0;
    transform: translateX(-25px);
    animation: fadeIn 0.3s ease-out forwards, transform 0.3s ease-out forwards;
}

@keyframes fadeIn {
    to {
        opacity: 1;
        transform: translateX(0);
    }
}
</style>
