<script setup>
import Toast from "../components/Toast/Toast.vue";
import { validateEmail } from "@/data/validation";

import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router';
import { setLoggedUser } from '../states/loggedUser.js'
import { EnvelopeIcon, KeyIcon } from "@heroicons/vue/24/solid";

const route = useRoute();

const apiLogin = import.meta.env.VITE_API_BASE_URL + '/login'
const email = ref()
const password = ref()

const showToast = ref(false);
const toastType = ref()
const toastTitle = ref()
const toastMsg = ref()

function login() {
    if (!email.value) {
        createToast("warning", "Attenzione!", "L'email non può essere vuota");
        return;
    }

    if (!validateEmail(email.value)) {
        createToast("error", "Errore!", "Indirizzo email non valido");
        return;
    }

    if (password.value.length < 8) {
        createToast("warning", "Attenzione!", "Inserisci una password di almeno 8 caratteri");
        return;
    }

    if (password.value === "") {
        createToast("warning", "Attenzione!", "La password non può essere vuota");
        return;
    }

    fetch(apiLogin, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email: email.value,
            password: password.value
        }),
    }).then((resp) => {
        if (resp.ok) {
            return resp.json().then(function (data) {
                setLoggedUser(data);
                createToast("success", "Successo!", "Login effettuato con successo");
            });
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

function handleCredentialResponse(response) {
    console.log("Encoded JWT ID token: " + response.credential);
}

onMounted(() => {
    // Toast di conferma registrazione
    if (route.query.fromLogin === 'true') {
        createToast("success", "Successo!", "Account creato con successo");
    }

    google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse
    });

    google.accounts.id.renderButton(
        document.getElementById("loginConGoogle"),
        {
            text: 'signin_with',
            size: 'large',
            theme: 'outline',
            logo_alignment: 'center'
        }
    );

    google.accounts.id.prompt();
});
</script>

<template>
    <Toast v-if="showToast" :type="toastType" :title="toastTitle" :msg="toastMsg" />

    <div class="div-login max-height flex justify-center items-center">
        <div class="bg-secondary rounded-3xl p-8">
            <form class="flex flex-col justify-center">
                <p class="text-2xl font-bold mb-6 text-center">Accedi</p>
                <label class="input input-bordered flex items-center gap-2 mb-4">
                    <EnvelopeIcon class="h-5 w-5 opacity-70"></EnvelopeIcon>
                    <input v-model="email" type="email" class="grow" placeholder="Indirizzo email" required />
                </label>
                <label class="input input-bordered flex items-center gap-2 mb-6">
                    <KeyIcon class="h-5 w-5 opacity-70"></KeyIcon>
                    <input v-model="password" type="password" class="grow" placeholder="Password" required />
                </label>
                <input @click="login()" type="button" value="Accedi"
                    class="btn btn-primary btn-outline btn-block rounded-lg" />
            </form>
            <p class="text-gray-400 text-sm text-center mt-2 mb-3">oppure</p>
            <div id="loginConGoogle"></div>
            <router-link to="/registrati">
                <p class="text-center text-sm mt-12">
                    Non sei registrato? <a class="link link-primary" href="/registrati.vue">Registrati!</a>
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
