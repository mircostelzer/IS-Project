<script setup>
import Toast from "../components/Toast/Toast.vue";
import { validateEmail } from "@/data/validation";

import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router';
import { EnvelopeIcon, EyeIcon, EyeSlashIcon, KeyIcon } from "@heroicons/vue/24/solid";

const router = useRouter();

const apiLogin = import.meta.env.VITE_API_BASE_URL + '/users'
const email = ref()
const password = ref()
const confirmPassword = ref()

const showPassword = ref(false)

const showToast = ref(false)
const toastType = ref()
const toastTitle = ref()
const toastMsg = ref()

async function register(withGoogle) {
    // Controllo degli input
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

    if (password.value !== confirmPassword.value) {
        createToast("warning", "Attenzione!", "Le password non corrispondono");
        return;
    }

    // In base al tipo di accesso, modifico il corpo della richiesta POST
    const bodyData = withGoogle ? { googleToken: googleToken } : { email: email.value, password: password.value };

    try {
        const resp = await fetch(apiLogin, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bodyData),
        });

        // Se la registrazione va a buon fine, reindirizzo alla pagina di login
        if (resp.ok) {
            router.push({ path: '/accedi', query: { fromRegister: 'true' } });
        } else {
            const errorData = await resp.json();
            createToast("error", "Errore!", errorData.message);
        }
    } catch (error) {
        createToast("error", "Errore!", error.message);
    }
};

onMounted(() => {
    google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse
    });

    google.accounts.id.renderButton(
        document.getElementById("registratiConGoogle"),
        {
            text: 'signup_with',
            size: 'large',
            theme: 'outline',
            logo_alignment: 'center'
        }
    );

    google.accounts.id.prompt();
});

function handleCredentialResponse(response) {
    if (response.credential) {
        googleToken.value = response.credential;
        console.log("Registrazione con Google effettuata");
        login(true);
    }
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

function togglePasswordView() {
    const passwordInput = document.getElementById("passwordInput");

    if (showPassword.value) {
        passwordInput.type = "password";
    } else {
        passwordInput.type = "text";
    }

    showPassword.value = !showPassword.value;
}
</script>

<template>
    <Toast v-if="showToast" :type="toastType" :title="toastTitle" :msg="toastMsg" />

    <div class="div-principale flex justify-center items-center">
        <div class="bg-secondary rounded-3xl p-8">
            <form class="flex flex-col justify-center">
                <p class="text-2xl font-bold mb-6 text-center">Registrati</p>
                <label class="input input-bordered flex items-center gap-2 mb-4">
                    <EnvelopeIcon class="size-5 opacity-70"></EnvelopeIcon>
                    <input v-model="email" type="email" class="grow" placeholder="Indirizzo email" required />
                </label>
                <div class="join">
                    <label class="input input-bordered join-item flex items-center gap-2 mb-6">
                        <KeyIcon class="size-5 opacity-70" />
                        <input id="passwordInput" v-model="password" type="password" class="grow" placeholder="Password"
                            required />
                    </label>
                    <button @click="togglePasswordView()" type="button"
                        :class="showPassword ? 'btn btn-primary join-item' : 'btn btn-error join-item'">
                        <EyeIcon v-if="showPassword" class="size-5 opacity-70" />
                        <EyeSlashIcon v-else class="size-5 opacity-70" />
                    </button>
                </div>
                <label class="input input-bordered flex items-center gap-2">
                    <KeyIcon class="size-5 opacity-70"></KeyIcon>
                    <input v-model="confirmPassword" type="password" class="grow" placeholder="Conferma password"
                        required />
                </label>
                <input @click="register()" type="button" value="Registrati"
                    class="btn btn-primary btn-outline btn-block rounded-lg mt-6" />
            </form>
            <p class="text-gray-400 text-sm text-center mt-2 mb-3">oppure</p>
            <div id="registratiConGoogle"></div>
            <router-link to="/accedi">
                <p class="text-center text-sm mt-12">
                    Già registrato? <a class="link link-primary" href="/accedi.vue">Accedi!</a>
                </p>
            </router-link>
        </div>
    </div>
</template>

<style scoped>
.div-principale {
    padding: min(50px, 3vw);
}
</style>
