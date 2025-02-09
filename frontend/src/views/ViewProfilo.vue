<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ArrowLeftEndOnRectangleIcon, ArrowPathIcon, PaperAirplaneIcon, UserCircleIcon } from "@heroicons/vue/24/solid";
import { loggedUser, clearLoggedUser } from '../states/loggedUser.js';

import TabellaEmergenze from '@/components/Tabelle/TabellaEmergenze.vue';
import Toast from '@/components/Toast/Toast.vue';

const route = useRoute();
const router = useRouter();

const host = import.meta.env.VITE_API_BASE_URL;
const apiEmergencies = host + '/emergencies';
const emergencies = ref([]);

const showToast = ref(false);
const toastType = ref()
const toastTitle = ref()
const toastMsg = ref()

// Se l'utente non è loggato, reindirizzo alla pagina di login
if (!loggedUser.token) {
    router.push({ path: '/accedi', query: { fromProfile: 'true' } });
} else {
    onMounted(() => {
        // Toast di conferma registrazione
        if (route.query.fromLogin === 'true') {
            createToast("success", "Successo!", "Accesso effettuato correttamente");
        }

        // Recupero le emergenze dell'utente con una chiamata fetch
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
}

function logout() {
    clearLoggedUser();
    router.push({ path: '/' });
}

// Funzione per formattare la data di registrazione dell'utente
function formatTime(time) {
    return new Date(time).toLocaleString('it-IT', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}

// Funzione per formattare il ruolo dell'utente
function formatRole(role) {
    return (role === "citizen") ? "Cittadino" : "Operatore";
}

function createToast(type, title, msg) {
    showToast.value = true;

    toastType.value = type;
    toastTitle.value = title;
    toastMsg.value = msg;

    setTimeout(() => {
        showToast.value = false;
    }, 5000);
}
</script>

<template>
    <Toast v-if="showToast" :type="toastType" :title="toastTitle" :msg="toastMsg" />

    <div v-if="loggedUser.token" class="div-principale w-full flex justify-center">
        <div class="max-w-7xl h-full">
            <div class="flex flex-row items-center mt-4 md:mt-0 mb-8">
                <UserCircleIcon class="size-8 md:size-12 me-3" />
                <h1 class="text-2xl md:text-4xl text-white font-bold">Il tuo profilo</h1>
            </div>


            <div class="div-sfondo w-full h-auto rounded-lg p-1 sm:p-2 md:p-4">
                <div class="div-opaco w-full p-4 mb-2 md:mb-4 rounded-md">
                    <p class="text-2xl font-bold text-slate-100 mb-3">Dati personali:</p>
                    <div class="columns-1 sm:columns-2 lg:columns-4">
                        <div>
                            <p class="text-white text-lg">Indirizzo email</p>
                            <p class="text-slate-200">{{ loggedUser.email }}</p>
                        </div>
                        <div>
                            <p class="text-white text-lg mt-4">Password (nascosta)</p>
                            <p class="text-slate-200">{{ loggedUser.hiddenPassword }}</p>
                        </div>
                        <div>
                            <p class="text-white text-lg">Registrato il</p>
                            <p class="text-slate-200">{{ formatTime(loggedUser.createdAt) }}</p>
                        </div>
                        <div>
                            <p class="text-white text-lg mt-4">Ruolo</p>
                            <p class="text-slate-200">{{ formatRole(loggedUser.role) }}</p>
                        </div>
                    </div>
                    <div class="flex justify-between mt-5">
                        <div>
                            <button @click="logout()" class="btn btn-sm btn-ghost btn-outline me-2">
                                <PaperAirplaneIcon class="w-5 h-5 opacity-80" />
                                Invia segnalazione
                            </button>
                            <button @click="logout()" class="btn btn-sm btn-ghost btn-outline me-2">
                                <ArrowPathIcon class="w-5 h-5 opacity-80" />
                                Cambia password
                            </button>
                        </div>
                        <div>
                            <button @click="logout()" class="btn btn-sm btn-error">
                                <ArrowLeftEndOnRectangleIcon class="w-5 h-5 opacity-80" />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
                <div class="div-opaco w-full p-4 rounded-md">
                    <p class="text-xl font-bold text-slate-100 mb-4">Le tue segnalazioni</p>
                    <TabellaEmergenze :emergencies="emergencies" />
                </div>
            </div>
        </div>
    </div>
    <div v-else>
    </div>
</template>

<style scoped>
.div-principale {
    padding: min(50px, 3vw);
}

.div-sfondo {
    background-color: #23351f80;
}

.div-opaco {
    background-color: #415d3b;
}
</style>
