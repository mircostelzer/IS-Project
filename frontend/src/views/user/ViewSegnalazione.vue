<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { loggedUser } from '../../states/loggedUser.js'
import { createReport } from '@/data/reports.js'

import { PaperAirplaneIcon } from "@heroicons/vue/24/solid"
import AccessDenied from '@/components/Error/AccessDenied.vue'
import AccessLimited from "@/components/Error/AccessLimited.vue"
import Toast from '@/components/Toast/Toast.vue'

const router = useRouter()

const description = ref()
const location = ref()
const coordinates = ref({
    lat: null,
    lon: null
});

const showToast = ref(false)
const toastType = ref()
const toastTitle = ref()
const toastMsg = ref()

function inviaSegnalazione() {
    if (!description.value) {
        createToast("error", "Errore!", "La descrizione è un campo obbligatorio");
        return;
    }

    if (!location.value) {
        createToast("error", "Errore!", "Il luogo è un campo obbligatorio");
        return;
    }

    const bodyData = {
        description: description.value,
        location: location.value,
        coordinates: {
            lat: coordinates.value.lat,
            lon: coordinates.value.lon
        },
        createdBy: loggedUser.id,
    };

    createReport(bodyData)
    router.push({ path: '/profilo', query: { sent: 'true' } })
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
    <div v-if="loggedUser.token && loggedUser.role === 'citizen'">
        <Toast v-if="showToast" :type="toastType" :title="toastTitle" :msg="toastMsg" />

        <div class="div-principale w-full flex justify-center">
            <div class="bg-secondary w-full max-w-4xl rounded-3xl p-8">
                <div class="flex flex-row items-center ms mt-4 md:mt-0 mb-8">
                    <PaperAirplaneIcon class="w-6 h-6 me-3" />
                    <p class="text-2xl font-bold">Invia segnalazione</p>
                </div>
                <form class="flex flex-col justify-center items-center">
                    <label class="form-control w-full">
                        <p class="text-slate-100 font-bold text-lg mb-2">Inserisci la descrizione:</p>
                        <textarea v-model="description" class="textarea h-32"
                            placeholder="Che succede? Spiegaci bene nel dettaglio cosa stai segnalando" maxlength="2500"
                            required></textarea>
                        <div class="label">
                            <span class="label-text-alt"><b>Campo obbligatorio</b> - Max 2500 caratteri</span>
                        </div>
                    </label>
                    <div class="columns-1 md:columns-2 w-full gap-6 mt-6">
                        <label class="form-control w-full">
                            <p class="text-slate-100 font-bold text-lg mb-2">Luogo coinvolto:</p>
                            <input v-model="location" type="text" placeholder="Che area coinvolge?" class="input"
                                maxlength="100" required />
                            <div class="label">
                                <span class="label-text-alt"><b>Campo obbligatorio</b> - Max 100 caratteri</span>
                            </div>
                        </label>
                        <label class="form-control w-full mt-6">
                            <p class="text-slate-100 font-bold text-lg mb-2">Coordinate del luogo:</p>
                            <div class="join w-full join-vertical sm:join-horizontal">
                                <input v-model="coordinates.lat" type="number"
                                    class="input w-full sm:w-3/4 join-item grow" placeholder="Latitudine" />
                                <input v-model="coordinates.lon" type="number"
                                    class="input w-full sm:w-3/4 join-item grow" placeholder="Longitudine" />
                            </div>
                            <div class="label">
                                <span class="label-text-alt">Campi facoltativi, <b>ma raccomandati</b></span>
                            </div>
                        </label>
                    </div>
                    <div class="w-full">
                        <input @click="inviaSegnalazione()" type="button" value="Invia segnalazione"
                            class="btn btn-wide btn-primary float-end rounded-lg mt-6" />
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
    padding: min(40px, 3vw);
}

.select {
    background-color: var(--input);
}

.textarea {
    background-color: var(--input);
}

/* Per nascondere le frecce di input="number" */
.no-arrows {
    margin: 0 !important;
    appearance: none !important;
    -webkit-appearance: none !important;
    -moz-appearance: textfield !important;
}
</style>
