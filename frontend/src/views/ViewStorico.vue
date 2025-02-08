<script setup>
import { ref, onMounted } from 'vue';
import { ClockIcon, MagnifyingGlassIcon, AdjustmentsHorizontalIcon, InformationCircleIcon } from "@heroicons/vue/24/solid";

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
    <div class="div-storico w-full flex justify-center">
        <div class="max-w-7xl h-full">
            <div class="flex flex-row items-center mt-4 md:mt-0 mb-8">
                <ClockIcon class="w-10 h-10 md:w-12 md:h-12 me-2" />
                <h1 class="text-3xl md:text-4xl text-white font-bold">Storico emergenze</h1>
            </div>

            <div class="w-full mb-8">
                <div class="flex flex-row items-center w-full mb-2">
                    <label class="input flex items-center w-full gap-2 pe-2">
                        <input type="text" class="grow" placeholder="Ricerca qui..." />
                        <button class="btn btn-sm btn-ghost btn-circle">
                            <MagnifyingGlassIcon class="w-5 h-5 opacity-80" />
                        </button>
                    </label>
                    <div class="dropdown dropdown-bottom dropdown-end">
                        <div tabindex="0" role="button" class="btn btn-filter ms-2">
                            <AdjustmentsHorizontalIcon class="w-5 h-5" />
                        </div>
                        <div tabindex="0"
                            class="dropdown-content menu bg-base-100 rounded-box z-[1] w-64 mt-2 p-4 shadow">
                            <div class="flex flex-row items-center mb-2">
                                <p>Ordina per:</p>
                                <select class="select select-bordered select-xs w-3/5 ms-2">
                                    <option disabled selected>Più recente</option>
                                    <option>Meno recente</option>
                                    <option>Più vicino</option>
                                    <option>Meno vicino</option>
                                    <option>In corso</option>
                                </select>
                            </div>
                            <p class="mb-1">Filtra per:</p>
                            <div class="flex flex-row items-center mb-2">
                                <div class="form-control">
                                    <label class="cursor-pointer flex flex-row items-center px-0 py-1">
                                        <input type="checkbox" checked="checked"
                                            class="checkbox checkbox-xs checkbox-success me-2" />
                                            <span class="label-text">Eventi meteorologici</span>
                                    </label>
                                    <label class="cursor-pointer flex flex-row items-center px-0 py-1">
                                        <input type="checkbox" checked="checked"
                                            class="checkbox checkbox-xs checkbox-success me-2" />
                                            <span class="label-text">Strutturali/Edili</span>
                                    </label>
                                    <label class="cursor-pointer flex flex-row items-center px-0 py-1">
                                        <input type="checkbox" checked="checked"
                                            class="checkbox checkbox-xs checkbox-success me-2" />
                                            <span class="label-text">Vegetazione</span>
                                    </label>
                                    <label class="cursor-pointer flex flex-row items-center px-0 py-1">
                                        <input type="checkbox" checked="checked"
                                            class="checkbox checkbox-xs checkbox-success me-2" />
                                            <span class="label-text">Incendi</span>
                                    </label>
                                    <label class="cursor-pointer flex flex-row items-center px-0 py-1">
                                        <input type="checkbox" checked="checked"
                                            class="checkbox checkbox-xs checkbox-success me-2" />
                                            <span class="label-text">Frane</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <span class="label-text-alt">{{ emergencies.length }} risultati trovati</span>
            </div>

            <div v-if="emergencies.length === 0" class="div-risultati w-full h-auto rounded-lg p-4">
                <p class="text-gray-300"><i>Nessun risultato trovato...</i></p>
            </div>
            <div v-else class="div-risultati w-full h-auto rounded-lg p-1 sm:p-2 md:p-4">
                <transition-group name="fade" tag="div">
                    <div v-for="(emergency, index) in emergencies" :key="recuperaId(emergency.self)"
                        class="div-risultato w-full p-4 mb-2 md:mb-4 rounded-md fade-in"
                        :style="{ animationDelay: `${index * 0.1}s` }">
                        <p class="text-medium text-2xl text-white">{{ emergency.title }}</p>
                        <p class="text-sm text-gray-300 mb-6" v-html="conDescrizione(emergency.description)"></p>
                        <div class="columns-1 md:columns-3">
                            <div class="pe-6">
                                <p class="text-slate-100">Categoria: </p>
                                <div class="badge badge-warning mt-1 text-sm">{{ emergency.category }}</div>
                            </div>
                            <div class="pe-6 mt-4">
                                <p class="text-slate-100">Data segnalazione: </p>
                                <p class="text-gray-300">{{ emergency.startDate }}</p>
                            </div>
                            <div class="pe-6 mt-4">
                                <p class="text-slate-100">Area interessata: </p>
                                <p class="text-gray-300">{{ emergency.location }}</p>
                            </div>
                        </div>
                        <div class="flex justify-end">
                            <router-link :to="`/dettagli?id=${recuperaId(emergency.self)}`">
                                <button class="btn btn-secondary float-end mt-3">
                                    <InformationCircleIcon class="w-5 h-5 opacity-80" />
                                    Maggiori informazioni
                                </button>
                            </router-link>
                        </div>
                    </div>
                </transition-group>
            </div>
        </div>
    </div>
</template>

<style scoped>
.div-storico {
    background-color: #424b43a6;
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
