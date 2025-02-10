<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router';
import { loggedUser } from '../states/loggedUser.js';
import AccessLimited from "@/components/Error/AccessLimited.vue";

import { MegaphoneIcon } from "@heroicons/vue/24/solid";
import AccessDenied from '@/components/Error/AccessDenied.vue';
import WrongURL from '@/components/Error/WrongURL.vue';

const route = useRoute();

const host = import.meta.env.VITE_API_BASE_URL;
const apiEmergency = host + '/emergencies/';

const emergency = ref(null);

const title = ref()
const category = ref('')
const startDate = ref()
const startTime = ref()
const location = ref()
const coordinates = ref({
    lat: null,
    lon: null
});
const state = ref('')
const description = ref()

const showToast = ref(false)
const toastType = ref()
const toastTitle = ref()
const toastMsg = ref()

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
            emergency.value = data

            title.value = emergency.value.title
            category.value = emergency.value.category
            const [date, time] = emergency.value.startDate.split('T');
            startDate.value = date;
            startTime.value = time;
            location.value = emergency.value.location
            coordinates.value = {
                lat: emergency.value.coordinates.lat,
                lon: emergency.value.coordinates.lon,
            };
            state.value = emergency.value.state
            description.value = emergency.value.description

            console.log('Values:', {
                title: title.value,
                category: category.value,
                startDate: startDate.value,
                startTime: startTime.value,
                location: location.value,
                coordinates: coordinates.value,
                state: state.value,
                description: description.value,
            });
        })
        .catch(error => {
            console.error('Errore:', error);
            emergency.value = null;
        });
});

function modificaComunicazione() {
    const updatedEmergency = {
        title: title.value,
        category: category.value,
        startDate: `${startDate.value}T${startTime.value}`,
        location: location.value,
        lat: coordinates.value.lat,
        lon: coordinates.value.lon,
        description: description.value
    };

    fetch(apiEmergency + route.query.id, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${loggedUser.token}`
        },
        body: JSON.stringify(updatedEmergency)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Errore HTTP con stato " + response.status);
            }
            return response.json();
        })
        .then(data => {
            createToast('success', 'Comunicazione modificata', 'La comunicazione è stata modificata con successo.');
        })
        .catch(error => {
            console.error('Errore:', error);
            createToast('error', 'Errore', 'Si è verificato un errore durante la modifica della comunicazione.');
        });
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
    <div v-if="loggedUser.token && loggedUser.role === 'operator'">
        <div v-if="emergency === null">
            <WrongURL />
        </div>

        <div v-else class="div-principale w-full flex justify-center">
            <div class="bg-secondary w-full max-w-6xl rounded-3xl p-8">
                <div class="flex flex-row items-center ms mt-4 md:mt-0 mb-8">
                    <MegaphoneIcon class="w-6 h-6 me-3" />
                    <p class="text-2xl font-bold">Modifica comunicazione</p>
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
                            <p class="text-slate-100 font-bold text-lg mb-2">Stato:</p>
                            <select v-model="state" class="select" required>
                                <option disabled selected>In che stato è l'emergenza?</option>
                                <option>In corso</option>
                                <option>Terminato</option>
                            </select>
                            <div class="label">
                                <span class="label-text-alt"><b>Campo obbligatorio</b></span>
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
                    <div class="columns-1 sm:columns-2 w-full gap-6 mt-6">
                        <label class="form-control w-full">
                            <p class="text-slate-100 font-bold text-lg mb-2">Luogo coinvolto:</p>
                            <input v-model="location" placeholder="Che area coinvolge?" class="input input-md"
                                maxlength="50" required />
                            <div class="label">
                                <span class="label-text-alt"><b>Campo obbligatorio</b> - Max 50 caratteri</span>
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
                    <input @click="modificaComunicazione()" type="button" value="Modifica comunicazione"
                        class="btn btn-primary btn-block rounded-lg mt-6" />
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
