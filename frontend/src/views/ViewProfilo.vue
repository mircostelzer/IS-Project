<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { MagnifyingGlassIcon, HomeIcon } from "@heroicons/vue/24/solid";

const route = useRoute();

const host = import.meta.env.VITE_API_BASE_URL;
const apiEmergency = host + '/emergencies/';

const emergency = ref(null);

// Funzione per recuperare l'id delle emergenze
const recuperaId = (self) => {
    return self.substring(self.lastIndexOf('/') + 1);
};

// Funzione per gestire la descrizione dell'emergenza'
const conDescrizione = (descrizione) => {
    return descrizione ? descrizione : '<i>Nessuna descrizione disponibile</i>';
};

onMounted(() => {
    // Recupero i dati dell'emergenza, se esistente, con una chiamata fetch
    fetch(apiEmergency + route.query.id)
        .then(response => {
            if (!response.ok) {
                throw new Error("Errore HTTP con stato " + response.status);
            }
            return response.json();
        })
        .then(data => {
            // Modifico l'oggetto emergenza per formattare startDate
            emergency.value = {
                ...data,
                startDate: new Date(data.startDate).toLocaleString('it-IT', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                })
            };
        })
        .catch(error => {
            console.error('Errore:', error);
            emergency.value = null; // Set emergency to null if there's an error
        });
});
</script>

<template>
    <div class="div-storico max-height w-full flex justify-center">
        <div class="max-w-7xl h-full">
            <div class="flex flex-row items-center mt-4 md:mt-0 mb-8">
                <MagnifyingGlassIcon class="w-6 h-6 md:w-8 md:h-8 me-3" />
                <h1 class="text-xl md:text-2xl text-white font-bold">Dettagli emergenza</h1>
            </div>

            <div v-if="emergency === null" class="div-risultati w-full h-auto rounded-lg p-4">
                <p class="text-gray-300"><i>Nessun risultato trovato...</i></p>
            </div>
            <div v-else class="div-risultato w-full px-8 py-4 mb-2 md:mb-4 rounded-2xl">
                <p class="text-sm text-gray-400 my-2">ID: {{ recuperaId(emergency.self) }}</p>
                <p class="font-bold text-3xl text-white mb-2">{{ emergency.title }}</p>
                <p class="text-gray-300 mb-6" v-html="conDescrizione(emergency.description)"></p>
                <div class="columns-1 md:columns-2">
                    <div class="pe-6">
                        <p class="text-slate-100 font-bold">Categoria: </p>
                        <div class="badge badge-warning mt-1 text-sm">{{ emergency.category }}</div>
                    </div>
                    <div class="pe-6 mt-6">
                        <p class="text-slate-100 font-bold">Area interessata: </p>
                        <p class="text-gray-300">{{ emergency.location }}</p>
                    </div>
                    <div class="pe-6 mt-6">
                        <p class="text-slate-100 font-bold">Stato: </p>
                        <div class="badge badge-primary mt-1 text-sm">{{ emergency.state }}</div>
                    </div>
                    <div class="pe-6 mt-6">
                        <p class="text-slate-100 font-bold">Data segnalazione: </p>
                        <p class="text-gray-300">{{ emergency.startDate }}</p>
                    </div>
                </div>
                <router-link to="/">
                    <button class="btn btn-secondary btn-block mt-6">
                        <HomeIcon class="w-5 h-5" />Ritorna alla home
                    </button>
                </router-link>
            </div>
        </div>
    </div>
</template>

<style scoped>
.div-storico {
    background-color: #424b43a6;
    padding: min(50px, 3vw);
}

.div-risultato {
    background-color: #415d3b;
}
</style>
