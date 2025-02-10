<script setup>
import { ref, onMounted } from 'vue'
import { loggedUser } from '../states/loggedUser.js';
import AccessLimited from "@/components/Error/AccessLimited.vue";

import { LockClosedIcon, MegaphoneIcon, ShieldCheckIcon, ShieldExclamationIcon, UserCircleIcon, UserIcon, UserPlusIcon } from "@heroicons/vue/24/solid";
import AccessDenied from '@/components/Error/AccessDenied.vue';
import TabellaEmergenze from '@/components/Tabelle/TabellaEmergenze.vue';

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

const emergencies = ref([]);

const showToast = ref(false)
const toastType = ref()
const toastTitle = ref()
const toastMsg = ref()

onMounted(() => {
    // Recupero le emergenze con una chiamata fetch
    fetch(apiEmergencies)
        .then(response => response.json())
        .then(data => {
            // Modifico l'array di emergenze per formattare startDate
            emergencies.value = data.map(emergency => {
                return {
                    ...emergency,
                    startDate: new Date(emergency.startDate).toLocaleString('it-IT', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    })
                };
            });
        })
        .catch(error => {
            console.error('Errore:', error);
        });
});

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
            <div class="div-opaco w-full max-w-6xl rounded-3xl p-8 overflow-x-clip">
                <div class="flex flex-row items-center ms mt-4 md:mt-0 mb-8">
                    <LockClosedIcon class="size-9 me-3" />
                    <p class="text-3xl font-bold">Dashboard operatore</p>
                </div>
                <div class="stats shadow flex align-middle">
                    <div class="stat">
                        <div class="stat-figure text-ghost">
                            <UserIcon class="inline-block size-12" />
                        </div>
                        <div class="stat-title">Cittadini</div>
                        <div class="stat-value">20</div>
                        <div class="stat-desc">98%</div>
                    </div>
                    <div class="stat">
                        <div class="stat-figure text-ghost">
                            <UserPlusIcon class="inline-block size-12" />
                        </div>
                        <div class="stat-title">Operatori comunali</div>
                        <div class="stat-value">20</div>
                        <div class="stat-desc">98%</div>
                    </div>
                    <div class="stat">
                        <div class="stat-figure text-accent">
                            <ShieldExclamationIcon class="inline-block size-12" />
                        </div>
                        <div class="stat-title">Segnalazioni in attesa</div>
                        <div class="stat-value">20</div>
                        <div class="stat-desc">98%</div>
                    </div>
                    <div class="stat">
                        <div class="stat-figure text-success">
                            <ShieldCheckIcon class="inline-block size-12" />
                        </div>
                        <div class="stat-title">Segnalazioni approvate</div>
                        <div class="stat-value">20</div>
                        <div class="stat-desc">98%</div>
                    </div>
                </div>

                <div class="divider my-8"></div>

                <div role="tablist" class="tabs tabs-lifted tabs-lg">
                    <input type="radio" name="tab-admin" role="tab" class="tab me-2" aria-label="Utenti"
                        checked="checked" />
                    <div role="tabpanel" class="tab-content border-green-950 rounded-box p-6">
                        Utenti
                    </div>

                    <input type="radio" name="tab-admin" role="tab" class="tab me-2" aria-label="Segnalazioni" />
                    <div role="tabpanel" class="tab-content border-green-950 rounded-box p-6">
                        Segnalazioni
                    </div>

                    <input type="radio" name="tab-admin" role="tab" class="tab me-2" aria-label="Comunicazioni" />
                    <div role="tabpanel" class="tab-content border-green-950 rounded-box p-6">
                        <TabellaEmergenze :emergencies="emergencies" :is-admin="true" />
                    </div>
                </div>
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

.div-opaco {
    background-color: #415d3b;
}

.stats {
    background-color: var(--background);
}

.tab {
    background-color: var(--background);
}

.tabs-lifted > .tab:is(input:checked) {
    background-color: var(--secondary);
}

.tab-content {
    background-color: var(--background);
}
</style>
