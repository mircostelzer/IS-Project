<script setup>
import { loggedUser } from '../states/loggedUser.js'

import { PaperAirplaneIcon } from "@heroicons/vue/24/solid"
import AccessDenied from '@/components/Error/AccessDenied.vue'
import AccessLimited from "@/components/Error/AccessLimited.vue"
</script>

<template>
    <div v-if="loggedUser.token && loggedUser.role === 'citizen'">
        <div class="div-principale w-full flex justify-center">
            <div class="bg-secondary w-full max-w-4xl rounded-3xl p-8">
                <div class="flex flex-row items-center ms mt-4 md:mt-0 mb-8">
                    <PaperAirplaneIcon class="w-6 h-6 me-3" />
                    <p class="text-2xl font-bold">Invia segnalazione</p>
                </div>
                <form class="flex flex-col justify-center items-center">
                    <label class="form-control w-full">
                        <p class="text-slate-100 font-bold text-lg mb-2">Inserisci la descrizione:</p>
                        <textarea class="textarea h-32"
                            placeholder="Che succede? Spiegaci bene nel dettaglio cosa stai segnalando" maxlength="1000"
                            required></textarea>
                        <div class="label">
                            <span class="label-text-alt"><b>Campo obbligatorio</b> - Max 1000 caratteri</span>
                        </div>
                    </label>
                    <label class="form-control w-full mt-6">
                        <p class="text-slate-100 font-bold text-lg mb-2">Inserisci il luogo:</p>
                        <input type="" placeholder="Che area coinvolge?" class="input input-md" maxlength="200"
                            required />
                        <div class="label">
                            <span class="label-text-alt"><b>Campo obbligatorio</b> - Max 200 caratteri</span>
                        </div>
                    </label>
                    <label class="form-control w-full mt-6">
                        <p class="text-slate-100 font-bold text-lg mb-2">Coordinate del luogo:</p>
                        <div class="join w-full join-vertical md:join-horizontal">
                            <input type="number" class="input no-arrows input-md join-item grow" placeholder="Latitudine" />
                            <input type="number" class="input no-arrows input-md join-item grow" placeholder="Longitudine" />
                        </div>
                        <div class="label">
                            <span class="label-text-alt">Campi facoltativi</span>
                        </div>
                    </label>
                    <input type="submit" value="Invia segnalazione"
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

/* Per nascondere le frecce di input="number" */
.no-arrows {
    margin: 0 !important;
    appearance: none !important;
    -webkit-appearance: none !important;
    -moz-appearance: textfield !important;
}
</style>
