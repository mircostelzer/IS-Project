<script setup>
import { ref } from 'vue'
import { loggedUser } from '../states/loggedUser.js';
import { createEmergency } from '@/data/emergencies.js';

import { MegaphoneIcon } from "@heroicons/vue/24/solid";
import AccessDenied from '@/components/Error/AccessDenied.vue';
import AccessLimited from "@/components/Error/AccessLimited.vue";
import Toast from '@/components/Toast/Toast.vue';

const title = ref()
const description = ref()
const category = ref("Di che tipo è l'emergenza?")
const state = ref("In che stato è l'emergenza?")
const startDate = ref()
const startTime = ref()
const location = ref()
const coordinates = ref({
    lat: null,
    lon: null
});

const showToast = ref(false)
const toastType = ref()
const toastTitle = ref()
const toastMsg = ref()

function pubblicaComunicazione() {
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

    const bodyData = {
        title: title.value,
        description: description.value,
        category: category.value,
        state: state.value,
        startDate: `${startDate.value}T${startTime.value}:00.000Z`,
        endDate: null,
        location: location.value,
        coordinates: {
            lat: coordinates.value.lat,
            lon: coordinates.value.lon
        }
    };

    createEmergency(bodyData)
    createToast("success", "Successo!", "Comunicazione pubblicata correttamente")
};

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

        <div class="div-principale w-full flex justify-center">
            <Toast v-if="showToast" :type="toastType" :title="toastTitle" :msg="toastMsg" />

            <div class="bg-secondary w-full max-w-6xl rounded-3xl p-8">
                <div class="flex flex-row items-center ms mt-4 md:mt-0 mb-8">
                    <MegaphoneIcon class="w-6 h-6 me-3" />
                    <p class="text-2xl font-bold">Pubblica comunicazione</p>
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
                            placeholder="Che succede? Spiegaci bene nel dettaglio cosa stai segnalando"
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
                                <option disabled selected>In che stato è l'emergenza?</option>
                                <option>in_progress</option>
                                <option>ended</option>
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
                        <input @click="pubblicaComunicazione()" type="button" value="Pubblica comunicazione"
                            class="btn btn-primary float-end rounded-lg mt-6" />
                        <input @click="$router.go(-1)" type="button" value="Annulla"
                            class="btn btn-ghost btn-outline float-end rounded-lg mt-6 me-2" />
                    </div>
                </form>
            </div>
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
</style>
