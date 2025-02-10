<script setup>
import { onMounted } from 'vue'
import { emergencies, getEmergencies } from '../data/emergencies'
import { liteClient as algoliasearch } from 'algoliasearch/lite'
import 'instantsearch.css/themes/algolia-min.css'

import { ClockIcon, AdjustmentsHorizontalIcon, InformationCircleIcon } from "@heroicons/vue/24/solid"
import BadgeStato from '@/components/Badge/BadgeStato.vue'
import BadgeCategoria from '@/components/Badge/BadgeCategoria.vue'

// Configurazione Algolia per la ricerca delle emergenze
const searchEmergencies = algoliasearch(import.meta.env.VITE_ALGOLIA_APP_ID, import.meta.env.VITE_ALGOLIA_SEARCH_KEY);

// Funzione per recuperare l'id delle emergenze
function recuperaId(self) {
    return self.substring(self.lastIndexOf('/') + 1)
}

onMounted(() => {
    getEmergencies()

    // Per nascondere i filtri al caricamento della pagina
    toggleFilters()
    toggleFilters()
});

function toggleFilters() {
    const filters = document.getElementById('filters');

    if (filters.style.display === 'none' || !filters.style.display) {
        filters.style.display = 'block';
    } else {
        filters.style.display = 'none';
    }
}
</script>

<template>
    <div class="div-principale w-full my-6 sm:my-12 px-4 flex justify-center">
        <div class="div-storico h-full">
            <div class="flex flex-row items-center mt-4 md:mt-0 mb-8">
                <ClockIcon class="w-10 h-10 md:w-12 md:h-12 me-2" />
                <h1 class="text-3xl md:text-4xl text-white font-bold">Storico emergenze</h1>
            </div>

            <ais-instant-search :search-client="searchEmergencies" index-name="emergencies_index"
                :future="{ preserveSharedStateOnUnmount: true }">
                <div class="w-full mb-8">
                    <div class="flex flex-row items-center w-full mb-2">
                        <ais-search-box placeholder="Ricerca qui..." submit-title="Invia" reset-title="Reset" />
                        <button @click="toggleFilters()" class="btn btn-filter ms-2">
                            <AdjustmentsHorizontalIcon class="w-5 h-5" />
                        </button>
                    </div>
                    <div id="filters" class="div-risultati w-full rounded-lg p-1 sm:p-2 md:p-4 mb-2">
                        <div class="div-risultato w-full p-4 rounded-md">
                            <div class="flex flex-row flex-wrap gap-3 text-white">
                                <div>
                                    <p class="mb-1">Ordina per:</p>
                                    <ais-sort-by :items="[
                                        { value: 'emergencies_index', label: 'Titolo (A-Z)' },
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
                            </div>
                            <div class="flex flex-row flex-wrap gap-3 text-white mt-4">
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

                <div v-if="emergencies.length === 0" class="div-risultati w-full h-auto rounded-lg p-4">
                    <p class="text-gray-300"><i>Nessun risultato trovato...</i></p>
                </div>
                <div v-else class="div-risultati w-full h-auto rounded-lg p-1 sm:p-2 md:p-4">
                    <ais-infinite-hits class="flex flex-col align-middle">
                        <template v-slot:item="{ item }">
                            <div class="div-risultato w-full p-4 rounded-md">
                                <BadgeStato :state="item.state" />
                                <p class="text-white text-2xl font-bold mt-2 mb-4">{{ item.title }}</p>
                                <div class="columns-1 md:columns-2">
                                    <div class="pe-6">
                                        <p class="text-slate-100">Categoria: </p>
                                        <BadgeCategoria :category="item.category" />
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
    width: min(100%, 1100px);
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
