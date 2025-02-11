<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import { loggedUser } from '../../states/loggedUser.js';
import { createEmergency } from '@/data/emergencies.js';
import { updateReport } from '@/data/reports.js';

import { CheckIcon, WrenchIcon, XMarkIcon } from "@heroicons/vue/24/solid";
import AccessDenied from '@/components/Error/AccessDenied.vue';
import AccessLimited from "@/components/Error/AccessLimited.vue";
import WrongURL from '@/components/Error/WrongURL.vue';
import Toast from '@/components/Toast/Toast.vue';

const route = useRoute();
const router = useRouter();

const apiReports = import.meta.env.VITE_API_BASE_URL + "/reports/";

const id = ref()
const title = ref()
const category = ref("Di che tipo è l'emergenza?")
const startDate = ref()
const startTime = ref()
const location = ref()
const coordinates = ref({
    lat: null,
    lon: null
});
const state = ref("In che stato è l'emergenza?")
const description = ref()

// Funzione per recuperare l'id della segnalazione
function recuperaId(self) {
    return self.substring(self.lastIndexOf("/") + 1);
}

onMounted(() => {
    fetch(apiReports + route.query.id, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${loggedUser.token}`,
        }
    })
        .then((response) => response.json())
        .then((data) => {
            if (data) {
                id.value = recuperaId(data.self),
                    description.value = data.description;
                location.value = data.location;
                coordinates.value = {
                    lat: data.coordinates.lat,
                    lon: data.coordinates.lon,
                };
                const [date, time] = data.startDate.split('T');
                startDate.value = date;
                startTime.value = time.slice(0, 5);
            }
        })
        .catch((error) => {
            console.error("Errore: ", error);
            createToast("error", "Errore!", "Errore nel recupero dei dati")
        });
});

function aggiornaSegnalazione(approved) {
    if (approved) {
        if (!title.value) {
            createToast("error", "Errore!", "Il titolo è un campo obbligatorio");
            return;
        }

        if (!category.value || category.value === "Di che tipo è l'emergenza?") {
            createToast("error", "Errore!", "La categoria è un campo obbligatorio");
            return;
        }

        if (!state.value || state.value === "In che stato è l'emergenza?") {
            createToast("error", "Errore!", "Lo stato è un campo obbligatorio");
            return;
        }

        if (!startDate.value || !startTime.value) {
            createToast("error", "Errore!", "La data e ora d'inizio sono campi obbligatori");
            return;
        }

        if (!location.value) {
            createToast("error", "Errore!", "Il luogo è un campo obbligatorio");
            return;
        }

        const newEmergency = {
            id: id.value,
            title: title.value,
            category: category.value,
            startDate: `${startDate.value}T${startTime.value}:00.000Z`,
            endDate: null,
            location: location.value,
            coordinates: {
                lat: coordinates.value.lat,
                lon: coordinates.value.lon
            },
            state: state.value,
            description: description.value,
        }

        const updatedReport = {
            id: id.value,
            state: "approved",
            description: description.value,
            location: location.value,
            coordinates: {
                lat: coordinates.value.lat,
                lon: coordinates.value.lon
            }
        }

        createEmergency(newEmergency)
        updateReport(updatedReport)
        router.push({ path: '/dashboard', query: { approved: 'true' } })
    } else {
        const updatedReport = {
            id: id.value,
            state: "rejected",
            description: description.value,
            location: location.value,
            coordinates: {
                lat: coordinates.value.lat,
                lon: coordinates.value.lon
            }
        }

        updateReport(updatedReport)
        router.push({ path: '/dashboard', query: { rejected: 'true' } })
    }
}

const showToast = ref(false)
const toastType = ref()
const toastTitle = ref()
const toastMsg = ref()

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
    <div v-if="loggedUser.token && loggedUser.role === 'operator'">
        <div v-if="!id">
            <WrongURL />
        </div>

        <div v-else class="div-principale w-full flex justify-center">
            <Toast v-if="showToast" class="high-z-index" :type="toastType" :title="toastTitle" :msg="toastMsg" />

            <div class="bg-secondary w-full max-w-6xl rounded-3xl p-8">
                <div class="flex flex-row items-center ms mt-4 md:mt-0 mb-8">
                    <WrenchIcon class="w-6 h-6 me-3" />
                    <p class="text-2xl font-bold">Conferma segnalazione</p>
                </div>
                <form class="flex flex-col justify-center items-center">
                    <label class="form-control w-full">
                        <p class="text-slate-100 font-bold text-lg mb-2">Titolo comunicazione:</p>
                        <input v-model="title" type="text" placeholder="Riassumi in un titolo la segnalazione"
                            class="input input-md w-full" maxlength="200" required />
                        <div class="label">
                            <span class="label-text-alt"><b>Campo obbligatorio</b> - Max 200 caratteri</span>
                        </div>
                    </label>
                    <label class="form-control w-full mt-6">
                        <p class="text-slate-100 font-bold text-lg mb-2">Descrizione:</p>
                        <textarea v-model="description" class="textarea h-32"
                            placeholder="Che succede? Spiega bene nel dettaglio cosa si sta segnalando"
                            maxlength="2500"></textarea>
                        <div class="label">
                            <span class="label-text-alt">Max 2500 caratteri</span>
                        </div>
                    </label>
                    <div class="columns-1 sm:columns-2 lg:columns-4 w-full gap-6 mt-6">
                        <label class="form-control w-full">
                            <p class="text-slate-100 font-bold text-lg mb-2">Categoria:</p>
                            <select v-model="category" class="select" required>
                                <option class="text-gray-400" disabled selected>Di che tipo è l'emergenza?</option>
                                <option>Frana</option>
                                <option>Alluvione</option>
                                <option>Ghiaccio</option>
                                <option>Crollo strutturale</option>
                                <option>Incendio</option>
                                <option>Neve</option>
                                <option>Tempesta</option>
                                <option>Caduta albero</option>
                            </select>
                            <div class="label">
                                <span class="label-text-alt"><b>Campo obbligatorio</b></span>
                            </div>
                        </label>
                        <label class="form-control w-full mt-6">
                            <p class="text-slate-100 font-bold text-lg mb-2">Stato:</p>
                            <select v-model="state" class="select" required>
                                <option class="text-gray-400" disabled selected>In che stato è l'emergenza?</option>
                                <option>In corso</option>
                                <option>Terminato</option>
                            </select>
                            <div class="label">
                                <span class="label-text-alt"><b>Campo obbligatorio</b></span>
                            </div>
                        </label>
                        <label class="form-control w-full mt-6">
                            <p class="text-slate-100 font-bold text-lg mb-2">Data inizio:</p>
                            <input v-model="startDate" type="date" class="input" required>
                            <div class="label">
                                <span class="label-text-alt"><b>Campo obbligatorio</b></span>
                            </div>
                        </label>
                        <label class="form-control w-full mt-6">
                            <p class="text-slate-100 font-bold text-lg mb-2">Ora inizio:</p>
                            <input v-model="startTime" type="time" class="input" required>
                            <div class="label">
                                <span class="label-text-alt"><b>Campo obbligatorio</b></span>
                            </div>
                        </label>
                    </div>
                    <div class="columns-1 sm:columns-2 w-full gap-6 mt-6">
                        <label class="form-control w-full">
                            <p class="text-slate-100 font-bold text-lg mb-2">Luogo coinvolto:</p>
                            <input v-model="location" type="text" placeholder="Che area coinvolge?"
                                class="input input-md" maxlength="100" required />
                            <div class="label">
                                <span class="label-text-alt"><b>Campo obbligatorio</b> - Max 100 caratteri</span>
                            </div>
                        </label>
                        <label class="form-control w-full mt-6">
                            <p class="text-slate-100 font-bold text-lg mb-2">Coordinate del luogo:</p>
                            <div class="join w-full join-vertical xl:join-horizontal">
                                <input v-model="coordinates.lat" type="number" class="input input-md join-item grow"
                                    placeholder="Latitudine" />
                                <input v-model="coordinates.lon" type="number" class="input input-md join-item grow"
                                    placeholder="Longitudine" />
                            </div>
                            <div class="label">
                                <span class="label-text-alt">Campi facoltativi</span>
                            </div>
                        </label>
                    </div>
                    <div class="w-full">
                        <button onclick="modalApprova.showModal()"
                            class="btn btn-outline btn-primary float-end rounded-lg mt-6">
                            <CheckIcon class="size-6 opacity-80" />
                            Approva
                        </button>
                        <button onclick="modalRifiuta.showModal()"
                            class="btn btn-outline btn-error float-end rounded-lg mt-6 me-4">
                            <XMarkIcon class="size-6 opacity-80" />
                            Rifiuta
                        </button>
                        <button @click="$router.go(-1)"
                            class="btn btn-outline btn-ghost float-end rounded-lg mt-6 me-4">
                            Torna alla dashboard
                        </button>
                    </div>
                </form>
            </div>

            <dialog id="modalApprova" class="modal modal-bottom sm:modal-middle">
                <div class="modal-box">
                    <form method="dialog">
                        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>
                    <h3 class="text-lg font-bold mb-2">Approvare la segnalazione?</h3>
                    <p class="text-sm text-gray-200">
                        La segnalazione verrà approvata e pubblicata a tutti gli effetti
                    </p>
                    <div class="modal-action">
                        <form method="dialog">
                            <button @click="aggiornaSegnalazione(true)" type="button" class="btn btn-success float-end">
                                <CheckIcon class="size-5 opacity-70" />
                                Conferma e approva
                            </button>
                            <button class="btn btn-ghost btn-outline me-2">Annulla</button>
                        </form>
                    </div>
                </div>
                <form method="dialog" class="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>

            <dialog id="modalRifiuta" class="modal modal-bottom sm:modal-middle">
                <div class="modal-box">
                    <form method="dialog">
                        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>
                    <h3 class="text-lg font-bold mb-2">Rifiutare la segnalazione?</h3>
                    <p class="text-sm text-gray-200">
                        La segnalazione verrà rifiutata, ma non eliminata
                    </p>
                    <div class="modal-action">
                        <form method="dialog">
                            <button @click="aggiornaSegnalazione(false)" type="button" class="btn btn-error float-end">
                                <XMarkIcon class="size-5 opacity-70" />
                                Conferma e rifiuta
                            </button>
                            <button class="btn btn-ghost btn-outline me-2">Annulla</button>
                        </form>
                    </div>
                </div>
                <form method="dialog" class="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>
        </div>
    </div>

    <div v-else-if="loggedUser.token">
        <AccessDenied />
    </div>

    <div v-else>
        <AccessLimited />
    </div>
</template>

<style scoped>
.div-principale {
    padding: min(50px, 3vw);
}

.select {
    background-color: var(--input);
}

.textarea {
    background-color: var(--input);
}

.high-z-index {
    z-index: 5000 !important;
}
</style>
