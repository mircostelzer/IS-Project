<script setup>
import { ref, onMounted } from 'vue';
import { liteClient as algoliasearch } from 'algoliasearch/lite';
import 'instantsearch.css/themes/algolia-min.css';

import { ClockIcon, MagnifyingGlassIcon, AdjustmentsHorizontalIcon, InformationCircleIcon } from "@heroicons/vue/24/solid";
import BadgeStato from '@/components/Badge/BadgeStato.vue';
import BadgeCategoria from '@/components/Badge/BadgeCategoria.vue';

const host = import.meta.env.VITE_API_BASE_URL;
const apiEmergencies = host + '/emergencies';

const searchResults = ref([]);

// Funzione per recuperare l'id delle emergenze
const recuperaId = (self) => {
    return self ? self.substring(self.lastIndexOf('/') + 1) : '';
};

// Funzione per gestire la descrizione delle emergenze
const conDescrizione = (descrizione) => {
    return descrizione ? descrizione : '<i>Nessuna descrizione disponibile</i>';
};

// Funzione per formattare la data di segnalazione delle emergenze
function formatTime(time) {
    return new Date(time).toLocaleString('it-IT', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}

onMounted(() => {
    // Recupero i dati delle emergenze con una chiamata fetch
    fetch(apiEmergencies)
        .then(response => response.json())
        .then(data => {
            // Modifico l'array di emergenze per formattare startDate
            searchResults.value = data.map(emergency => {
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

    showFilters();
});

function showFilters() {
    const filters = document.getElementById('filters');

    if (filters.style.display === 'none' || !filters.style.display) {
        filters.style.display = 'block';
    } else {
        filters.style.display = 'none';
    }
}

// Configurazione Algolia per la ricerca delle emergenze
const searchClient = algoliasearch(import.meta.env.VITE_ALGOLIA_APP_ID, import.meta.env.VITE_ALGOLIA_SEARCH_KEY);

// Aggiorna i dati ottenuti da emergencies e gli invia ad Algolia
function updateAlgoliaRecords() {
    const algolia = algoliasearch(import.meta.env.VITE_ALGOLIA_APP_ID, import.meta.env.VITE_ALGOLIA_WRITE_KEY);

    const processRecords = async () => {
        // Svuoto prima il vecchio indice di Algolia
        const response = await algolia.clearObjects({ indexName: 'emergencies_index' });

        // Inserisco i dati aggiornati dalla chiamata API
        const datasetRequest = await fetch(apiEmergencies);
        const emergenciesRecord = await datasetRequest.json();
        return await algolia.saveObjects({ indexName: 'emergencies_index', objects: emergenciesRecord });
    };

    processRecords()
        .then(() => console.log('Algolia: emergencies successfully updated and indexed'))
        .catch((err) => console.error(err));
}
</script>

<template>
    <div class="div-principale w-full my-6 sm:my-12 px-4 flex justify-center">
        <div class="max-w-5xl h-full">
            <div class="flex flex-row items-center mt-4 md:mt-0 mb-8">
                <ClockIcon class="w-10 h-10 md:w-12 md:h-12 me-2" />
                <h1 class="text-3xl md:text-4xl text-white font-bold">Storico emergenze</h1>
            </div>

            <ais-instant-search :search-client="searchClient" index-name="emergencies_index">
                <div class="w-full mb-8">
                    <div class="flex flex-row items-center w-full mb-2">
                        <ais-search-box placeholder="Ricerca qui..." submit-title="Invia" reset-title="Reset" />
                        <button @click="showFilters()" class="btn btn-filter ms-2">
                            <AdjustmentsHorizontalIcon class="w-5 h-5" />
                        </button>
                    </div>
                    <div id="filters" class="div-risultati w-full rounded-lg p-1 sm:p-2 md:p-4 mb-2">
                        <div class="div-risultato w-full p-4 rounded-md">
                            <div class="flex flex-row flex-wrap gap-3">
                                <div>
                                    <p class="mb-1">Ordina per:</p>
                                    <ais-sort-by :items="[
                                        { value: 'emergencies_index_title_asc', label: 'Titolo (A-Z)' },
                                        { value: 'emergencies_index_title_desc', label: 'Titolo (Z-A)' },
                                        { value: 'emergencies_index_location_asc', label: 'Area (A-Z)' },
                                        { value: 'emergencies_index_location_desc', label: 'Area (Z-A)' },
                                        { value: 'emergencies_index_startDate_desc', label: 'Data (Più recente)' },
                                        { value: 'emergencies_index_startDate_asc', label: 'Data (Meno recente)' },
                                    ]" />
                                </div>
                                <div>
                                    <p class="mb-1">Mostra:</p>
                                    <ais-hits-per-page :items="[
                                        { label: '10 risultati alla volta', value: 10, default: true },
                                        { label: '25 risultati alla volta', value: 25 },
                                        { label: '50 risultati alla volta', value: 50 }
                                    ]" />
                                </div>
                                <div>
                                    <p class="mb-1">Stato:</p>
                                    <ais-refinement-list attribute="state" />
                                </div>
                                <div>
                                    <p class="mb-1">Categoria:</p>
                                    <ais-refinement-list attribute="category" />
                                </div>
                            </div>
                            <div class="flex justify-end mt-4">
                                <ais-clear-refinements />
                            </div>
                        </div>
                    </div>
                    <ais-stats />
                </div>

                <div v-if="searchResults.length === 0" class="div-risultati w-full h-auto rounded-lg p-4">
                    <p class="text-gray-300"><i>Nessun risultato trovato...</i></p>
                </div>
                <div v-else class="div-risultati w-full h-auto rounded-lg p-1 sm:p-2 md:p-4">
                    <ais-infinite-hits class="flex flex-col align-middle">
                        <template v-slot:item="{ item }">
                            <div class="div-risultato w-full p-4 rounded-md">
                                <div class="flex flex-row items-center">
                                    <p class="text-medium text-2xl text-white">{{ item.title }}</p>
                                    <BadgeStato :state="item.state" class="ms-2" />
                                </div>
                                <p class="text-sm text-gray-300 mb-6" v-html="conDescrizione(item.description)">
                                </p>
                                <div class="columns-1 md:columns-3">
                                    <div class="pe-6">
                                        <p class="text-slate-100">Categoria: </p>
                                        <BadgeCategoria :category="item.category" />
                                    </div>
                                    <div class="pe-6 mt-4">
                                        <p class="text-slate-100">Data segnalazione: </p>
                                        <p class="text-gray-300">{{ formatTime(item.startDate) }}</p>
                                    </div>
                                    <div class="pe-6 mt-4">
                                        <p class="text-slate-100">Area interessata: </p>
                                        <p class="text-gray-300">{{ item.location }}</p>
                                    </div>
                                </div>
                                <div class="flex justify-end">
                                    <router-link :to="`/dettagli?id=${recuperaId(item.self)}`">
                                        <button class="btn btn-secondary float-end mt-3">
                                            <InformationCircleIcon class="w-5 h-5 opacity-80" />
                                            Maggiori informazioni
                                        </button>
                                    </router-link>
                                </div>
                            </div>
                        </template>
                    </ais-infinite-hits>
                </div>
            </ais-instant-search>

        </div>
    </div>
</template>

<style scoped>
.div-storico {
    padding: min(50px, 3vw);
}

.div-risultati {
    background-color: #23351f80;
}

.div-risultato {
    background-color: #415d3b;
}

.btn-filter {
    background-color: #415d3b;
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
