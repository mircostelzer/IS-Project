<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { loggedUser, loadUserFromCookies, clearLoggedUser } from '../../states/loggedUser.js'

import Toast from '@/components/Toast/Toast.vue'
import AccessLimited from '@/components/Error/AccessLimited.vue'
import { ArrowLeftEndOnRectangleIcon, ArrowPathIcon, EyeIcon, EyeSlashIcon, KeyIcon, PaperAirplaneIcon, UserCircleIcon } from "@heroicons/vue/24/solid"
import TabellaSegnalazioni from '@/components/Tabelle/TabellaSegnalazioni.vue'
import { reports, getMyReports } from '@/data/reports'

const route = useRoute()
const router = useRouter()

const oldPassword = ref("")
const newPassword = ref("")
const confirmNewPassword = ref("")
const showPassword = ref(false)

const showToast = ref(false)
const toastType = ref()
const toastTitle = ref()
const toastMsg = ref()

// Se l'utente si è loggato
if (loggedUser.token) {
    loadUserFromCookies()

    onMounted(() => {
        // Toast di conferma registrazione
        if (route.query.fromLogin === 'true') {
            createToast("success", "Successo!", "Accesso effettuato correttamente");
        }

        // Toast di conferma invio segnalazione
        if (route.query.sent === 'true') {
            createToast("success", "Successo!", "Segnalazione inviata correttamente");
        }

        // Recupero le segnalazioni inviate dall'utente
        if (loggedUser.role === "citizen") {
            getMyReports()
        }
    });
}

// Funzione per effettuare il logout dell'utente
function logout() {
    clearLoggedUser();
    router.push({ path: '/accedi', query: { limited: 'true' } });
}

// Funzione per formattare la data di registrazione dell'utente
function formatTime(time) {
    return new Date(time).toLocaleString('it-IT', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}

// Funzione per formattare il ruolo dell'utente
function formatRole(role) {
    return (role === "citizen") ? "Cittadino" : "Operatore";
}

// Funzione per cambiare la password dell'utente
async function changePassword() {
    if (newPassword.value.length < 8) {
        createToast("warning", "Attenzione!", "Inserisci una password di almeno 8 caratteri");
        return;
    }

    if (newPassword.value === "" || confirmNewPassword.value === "") {
        createToast("warning", "Attenzione!", "I campi non possono essere vuoti");
        return;
    }

    if (newPassword.value !== confirmNewPassword.value) {
        createToast("warning", "Attenzione!", "Le password non corrispondono");
        return;
    }

    try {
        const apiPassword = import.meta.env.VITE_API_BASE_URL + "/users/"

        const resp = await fetch(apiPassword + loggedUser.id + "/password", {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${loggedUser.token}`,
            },
            body: JSON.stringify({
                oldPassword: oldPassword.value,
                newPassword: newPassword.value
            }),
        });

        // Se il cambio password va a buon fine, effettuo il logout e reindirizzo alla pagina di login
        if (resp.ok) {
            clearLoggedUser();
            router.push({ path: '/accedi', query: { passwordChange: 'true' } });
        } else {
            const errorData = await resp.json();
            createToast("error", "Errore!", errorData.message);
        }
    } catch (error) {
        createToast("error", "Errore!", error.message);
    }
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
    <div v-if="loggedUser.token">
        <Toast v-if="showToast" :type="toastType" :title="toastTitle" :msg="toastMsg" />

        <div class="div-principale w-full flex justify-center">
            <div class="w-full max-w-6xl h-full">
                <div class="flex flex-row items-center mt-4 md:mt-0 mb-8">
                    <UserCircleIcon class="size-8 md:size-12 me-3" />
                    <h1 class="text-2xl md:text-4xl text-white font-bold">Il tuo profilo</h1>
                </div>


                <div class="div-sfondo w-full h-auto rounded-lg p-1 sm:p-2 md:p-4">
                    <div class="div-opaco w-full p-4 rounded-md">
                        <p class="text-2xl font-bold text-slate-100 mb-3">Dati personali:</p>
                        <div class="columns-1 sm:columns-2 lg:columns-4">
                            <div>
                                <p class="text-white text-lg">Indirizzo email</p>
                                <p class="text-slate-200 user-value">{{ loggedUser.email }}</p>
                            </div>
                            <div>
                                <p class="text-white text-lg mt-4">Password (nascosta)</p>
                                <p class="text-slate-200 user-value">{{ loggedUser.hiddenPassword }}</p>
                            </div>
                            <div>
                                <p class="text-white text-lg">Registrato il</p>
                                <p class="text-slate-200 user-value">{{ formatTime(loggedUser.createdAt) }}</p>
                            </div>
                            <div>
                                <p class="text-white text-lg mt-4">Ruolo</p>
                                <p class="text-slate-200 user-value">{{ formatRole(loggedUser.role) }}</p>
                            </div>
                        </div>
                        <div class="flex flex-row justify-between sm:justify-end mt-5">
                            <button onclick="modalPassword.showModal()"
                                class="btn btn-sm btn-warning btn-outline mb-2 me-0 sm:me-2">
                                <ArrowPathIcon class="w-5 h-5 opacity-80" />
                                Cambia password
                            </button>
                            <button @click="logout()" class="btn btn-sm btn-error mb-2">
                                <ArrowLeftEndOnRectangleIcon class="w-5 h-5 opacity-80" />
                                Logout
                            </button>
                        </div>
                    </div>
                    <div v-if="loggedUser.role === 'citizen'" class="div-opaco w-full p-4 mt-2 md:mt-4 rounded-md">
                        <p class="text-2xl font-bold text-slate-100 mt-2 mb-6">Le tue segnalazioni:</p>
                        <TabellaSegnalazioni :reports="reports" :is-operator="false" />
                    </div>
                </div>
            </div>
        </div>

        <dialog id="modalPassword" class="modal modal-bottom sm:modal-middle">
            <div class="modal-box">
                <form method="dialog">
                    <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                </form>
                <h3 class="text-lg font-bold mb-4">Cambia password:</h3>
                <form>
                    <label class="input input-bordered flex items-center gap-2 mb-3">
                        <KeyIcon class="size-5 opacity-70"></KeyIcon>
                        <input v-model="oldPassword" type="password" class="grow" placeholder="Vecchia password"
                            required />
                    </label>
                    <div class="join w-full mb-3">
                        <label class="input input-bordered join-item flex items-center gap-2 full-width">
                            <KeyIcon class="size-5 opacity-70" />
                            <input v-model="newPassword" id="passwordInput" type="password" class="grow"
                                placeholder="Nuova password" required />
                        </label>
                        <button @click="togglePasswordView()" type="button"
                            :class="showPassword ? 'btn btn-primary join-item' : 'btn btn-error join-item'">
                            <EyeIcon v-if="showPassword" class="size-5 opacity-70" />
                            <EyeSlashIcon v-else class="size-5 opacity-70" />
                        </button>
                    </div>
                    <label class="input input-bordered flex items-center gap-2">
                        <KeyIcon class="size-5 opacity-70"></KeyIcon>
                        <input v-model="confirmNewPassword" type="password" class="grow"
                            placeholder="Conferma nuova password" required />
                    </label>
                    <input @click="changePassword()" type="button" value="Cambia password"
                        class="btn btn-primary btn-outline float-end rounded-lg mt-6" />
                    <div class="modal-action">
                        <form method="dialog">
                            <button class="btn btn-ghost me-2">Annulla</button>
                        </form>
                    </div>
                </form>
            </div>
            <form method="dialog" class="modal-backdrop">
                <button>close</button>
            </form>
        </dialog>
    </div>

    <div v-else>
        <AccessLimited />
    </div>

</template>

<style scoped>
.div-principale {
    padding: min(50px, 3vw);
}

.div-sfondo {
    background-color: #23351f80;
}

.div-opaco {
    background-color: #415d3b;
}

.user-value {
    overflow-x: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}

.modal-box {
    background-color: var(--foreground);
}

.full-width {
    width: 100%;
}
</style>
