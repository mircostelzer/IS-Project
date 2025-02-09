<script setup>
import { ref, onMounted } from 'vue';
import Mappa from "../components/Mappa/Mappa.vue";
import { ArrowsPointingOutIcon } from "@heroicons/vue/24/solid";

const host = import.meta.env.VITE_API_BASE_URL;
const apiEmergencies = host + '/emergencies';

const emergencies = ref([]);

// Funzione per recuperare l'id delle emergenze
const recuperaId = (self) => {
    return self.substring(self.lastIndexOf('/') + 1);
};

// Funzione per gestire la descrizione delle emergenze
const conDescrizione = (descrizione) => {
    return descrizione ? descrizione : '<i>Nessuna descrizione disponibile</i>';
};

// Ottengo l'ora attuale
const requestTime = new Date().toLocaleString('it-IT', {
    hour: '2-digit',
    minute: '2-digit'
});

onMounted(() => {
    // Recupero i dati delle emergenze con una chiamata fetch
    fetch(apiEmergencies)
        .then(response => response.json())
        .then(data => {
            // Modifico l'array di emergenze per formattare startDate
            emergencies.value = data.map(emergency => {
                return {
                    ...emergency,
                    startDate: new Date(emergency.startDate).toLocaleString('it-IT', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    })
                };
            });
        })
        .catch(error => {
            console.error('Errore:', error);
        });
});
</script>

<template>
    <div class="max-height flex flex-col lg:flex-row">
        <div class="div-emergenze h-2/5 lg:h-full w-full lg:max-w-xl p-6">
            <h1 class="text-2xl font-semibold my-2">&#128680 Emergenze in corso</h1>
            <p class="text-md font-light mb-8">
                Ultimo aggiornamento: <span class="text-gray-300">{{ requestTime }}</span>
            </p>

            <div v-if="emergencies.length === 0" class="div-risultati w-full h-auto">
                <p class="text-gray-300"><i>Nessun risultato trovato...</i></p>
            </div>
            <transition-group v-else name="fade" tag="div">
                <div v-for="(emergency, index) in emergencies" :key="recuperaId(emergency.self)"
                    class="collapse-emergenza collapse collapse-arrow mt-2 fade-in"
                    :style="{ animationDelay: `${index * 0.05}s` }">
                    <input type="radio" name="lista-emergenze" />
                    <div class="collapse-title text-xl font-medium text-white">{{ emergency.title }}</div>
                    <div class="collapse-content">
                        <p class="text-sm text-gray-300 mb-4" v-html="conDescrizione(emergency.description)"></p>
                        <div class="columns-2">
                            <div>
                                <p class="text-slate-100">Categoria: </p>
                                <div class="badge badge-warning mt-1 text-sm">{{ emergency.category }}</div>
                            </div>
                            <div>
                                <p class="text-slate-100">Data segnalazione: </p>
                                <p class="text-sm text-gray-300">{{ emergency.startDate }}</p>
                            </div>
                        </div>
                        <router-link :to="`/dettagli?id=${recuperaId(emergency.self)}`">
                            <button class="btn btn-secondary btn-sm float-end mt-3">
                                <ArrowsPointingOutIcon class="w-4 h-4 opacity-80 -mx-0.5 mb-0.5" />Espandi
                            </button>
                        </router-link>
                    </div>
                </div>
            </transition-group>
        </div>
        <Mappa />
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
