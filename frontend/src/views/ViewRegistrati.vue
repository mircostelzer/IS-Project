<script setup>
import { EnvelopeIcon, KeyIcon } from "@heroicons/vue/24/solid";
</script>

<template>
    <div class="div-login max-height flex justify-center items-center">
        <div class="bg-secondary rounded-3xl p-8">
            <form class="flex flex-col justify-center">
                <p class="text-2xl font-bold mb-6 text-center">Registrati</p>
                <label class="input input-bordered flex items-center gap-2 mb-4">
                    <EnvelopeIcon class="h-5 w-5 opacity-70"></EnvelopeIcon>
                    <input type="email" class="grow" placeholder="Indirizzo email" required />
                </label>
                <label class="input input-bordered flex items-center gap-2 mb-4">
                    <KeyIcon class="h-5 w-5 opacity-70"></KeyIcon>
                    <input type="password" class="grow" placeholder="Password" required />
                </label>
                <label class="input input-bordered flex items-center gap-2 mb-3">
                    <KeyIcon class="h-5 w-5 opacity-70"></KeyIcon>
                    <input type="password" class="grow" placeholder="Conferma password" required />
                </label>
                <label class="label cursor-pointer justify-normal">
                    <input type="checkbox" class="toggle toggle-warning toggle-xs me-2" />
                    <span class="label-text text-xs"><b>PER DEMO:</b> con privilegi operatore</span>
                </label>
                <input type="submit" value="Registrati" class="btn btn-primary btn-outline btn-block rounded-lg mt-6" />
            </form>
            <p class="text-gray-400 text-sm text-center my-3">oppure</p>
            <input type="submit" value="Registrati con Google"
                class="btn btn-foreground btn-outline btn-block rounded-lg" />
            <router-link to="/accedi">
                <p class="text-center text-sm mt-12">
                    Già registrato? <a class="link link-primary" href="/accedi.vue">Accedi!</a>
                </p>
            </router-link>
        </div>
    </div>
</template>

<style scoped>
.div-login {
    background-color: #424b43a6;
    padding: min(50px, 3vw);
}
</style>
