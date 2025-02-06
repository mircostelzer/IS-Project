<script setup>
import { PaperAirplaneIcon } from "@heroicons/vue/24/solid";
</script>

<template>
    <div class="div-segnalazione max-height w-full flex justify-center">
        <div class="max-w-7xl h-full">
            <div class="bg-secondary rounded-3xl p-8">
                <div class="flex flex-row items-center ms mt-4 md:mt-0 mb-8">
                    <PaperAirplaneIcon class="w-6 h-6 me-3" />
                    <p class="text-2xl font-bold">Invia segnalazione</p>
                </div>
                <form class="flex flex-col justify-center items-center">
                    <label class="form-control w-full">
                        <p class="text-slate-100 text-lg mb-2">Titolo segnalazione:</p>
                        <input type="text" placeholder="Cosa stai segnalando?" class="input input-md w-full"
                            maxlength="50" required />
                        <div class="label">
                            <span class="label-text-alt"><b>Campo obbligatorio</b> - Max 50 caratteri</span>
                        </div>
                    </label>
                    <div class="columns-1 md:columns-2 gap-8 mt-6">
                        <label class="form-control w-full">
                            <p class="text-slate-100 text-lg mb-2">Categoria emergenza:</p>
                            <select class="select" required>
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
                        <label class="form-control w-full">
                            <p class="text-slate-100 text-lg mb-2">Posizione emergenza:</p>
                            <input type="" placeholder="Che area coinvolge?" class="input input-md w-full"
                                required />
                            <div class="label">
                                <span class="label-text-alt"><b>Campo obbligatorio</b></span>
                            </div>
                        </label>
                    </div>
                    <label class="form-control w-full mt-6">
                        <p class="text-slate-100 text-lg mb-2">Descrizione segnalazione:</p>
                        <textarea class="textarea h-24" placeholder="Che informazioni puoi aggiungere?"
                            maxlength="250"></textarea>
                        <div class="label">
                            <span class="label-text-alt"><b>Campo obbligatorio</b> - Max 250 caratteri</span>
                        </div>
                    </label>
                    <input type="submit" value="Invia segnalazione"
                        class="btn btn-primary btn-outline btn-block rounded-lg mt-6" />
                </form>
            </div>
        </div>
    </div>
</template>

<style scoped>
.div-segnalazione {
    background-color: #424b43a6;
    padding: min(50px, 3vw);
}

.select {
    background-color: var(--input);
}

.textarea {
    background-color: var(--input);
}
</style>
