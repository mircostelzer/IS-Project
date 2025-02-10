<script setup>
import { ref } from 'vue'
import { loggedUser } from '../states/loggedUser.js';
import AccessLimited from "@/components/Error/AccessLimited.vue";

import { PaperAirplaneIcon } from "@heroicons/vue/24/solid";
import AccessDenied from '@/components/Error/AccessDenied.vue';

const apiEmergencies = import.meta.env.VITE_API_BASE_URL + '/emergencies'
const title = ref()
const description = ref()
const category = ref()
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

function inviaComunicazione() {
    const bodyData = {
        title: title.value,
        description: description.value,
        category: category.value,
        startDate: new Date(`${startDate.value}T${startTime.value}`),
        location: location.value,
        coordinates: {
            lat: coordinates.value.lat,
            lon: coordinates.value.lon
        }
    };

    fetch(apiEmergencies, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData),
    }).then((resp) => {
        if (resp.ok) {
            createToast("success", "Successo!", "Segnalazione inviata correttamente");
        } else {
            resp.json().then((errorData) => {
                createToast("error", "Errore!", errorData.message);
            });
        }
    });
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
    <div v-if="loggedUser.token && loggedUser.role === 'admin'">
        <div class="div-principale w-full flex justify-center">
            <div class="bg-secondary w-full max-w-6xl rounded-3xl p-8">
                <div class="flex flex-row items-center ms mt-4 md:mt-0 mb-8">
                    <PaperAirplaneIcon class="w-6 h-6 me-3" />
                    <p class="text-2xl font-bold">Pubblica comunicazione</p>
                </div>
                <form class="flex flex-col justify-center items-center">
                    <label class="form-control w-full">
                        <p class="text-slate-100 font-bold text-lg mb-2">Titolo comunicazione:</p>
                        <input v-model="title" type="text" placeholder="Riassumi in un titolo la segnalazione"
                            class="input input-md w-full" maxlength="50" required />
                        <div class="label">
                            <span class="label-text-alt"><b>Campo obbligatorio</b> - Max 50 caratteri</span>
                        </div>
                    </label>
                    <label class="form-control w-full mt-6">
                        <p class="text-slate-100 font-bold text-lg mb-2">Descrizione:</p>
                        <textarea v-model="description" class="textarea h-32"
                            placeholder="Che succede? Spiegaci bene nel dettaglio cosa stai segnalando"
                            maxlength="500"></textarea>
                        <div class="label">
                            <span class="label-text-alt">Max 500 caratteri</span>
                        </div>
                    </label>
                    <div class="columns-1 sm:columns-2 lg:columns-4 w-full gap-6 mt-6">
                        <label class="form-control w-full">
                            <p class="text-slate-100 font-bold text-lg mb-2">Categoria:</p>
                            <select v-model="category" class="select" required>
                                <option disabled selected>Di che tipo è l'emergenza?</option>
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
                            <p class="text-slate-100 font-bold text-lg mb-2">Luogo coinvolto:</p>
                            <input v-model="location" placeholder="Che area coinvolge?" class="input input-md"
                                maxlength="50" required />
                            <div class="label">
                                <span class="label-text-alt"><b>Campo obbligatorio</b> - Max 50 caratteri</span>
                            </div>
                        </label>
                        <label class="form-control w-full mt-6">
                            <p class="text-slate-100 font-bold text-lg mb-2">Data inizio:</p>
                            <input v-model="startDate" class="input" name="startDate" type="date" required>
                            <div class="label">
                                <span class="label-text-alt"><b>Campo obbligatorio</b></span>
                            </div>
                        </label>
                        <label class="form-control w-full mt-6">
                            <p class="text-slate-100 font-bold text-lg mb-2">Ora inizio:</p>
                            <input v-model="startTime" class="input" name="startTime" type="time" required>
                            <div class="label">
                                <span class="label-text-alt"><b>Campo obbligatorio</b></span>
                            </div>
                        </label>
                    </div>
                    <label class="form-control w-full mt-6">
                        <p class="text-slate-100 font-bold text-lg mb-2">Coordinate del luogo:</p>
                        <div class="join w-full join-vertical md:join-horizontal">
                            <input v-model="coordinates.lat" type="number" class="input input-md join-item grow"
                                placeholder="Latitudine" required />
                            <input v-model="coordinates.lon" type="number" class="input input-md join-item grow"
                                placeholder="Longitudine" required />
                        </div>
                        <div class="label">
                            <span class="label-text-alt"><b>Campi obbligatori</b></span>
                        </div>
                    </label>
                    <input @click="inviaComunicazione()" type="button" value="Pubblica comunicazione"
                        class="btn btn-primary btn-outline btn-block rounded-lg mt-6" />
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
