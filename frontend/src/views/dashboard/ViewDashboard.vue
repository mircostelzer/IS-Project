<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { loggedUser } from '../../states/loggedUser.js'
import { users, getUsers, nUsers } from '../../data/users'
import { reports, getReports, nReports } from '../../data/reports'
import { emergencies, getEmergencies, nEmergencies } from '../../data/emergencies'

import { LockClosedIcon, ShieldCheckIcon, ShieldExclamationIcon, UserIcon, UserPlusIcon } from "@heroicons/vue/24/solid"
import AccessDenied from '@/components/Error/AccessDenied.vue'
import AccessLimited from "@/components/Error/AccessLimited.vue"
import TabellaEmergenze from '@/components/Tabelle/TabellaEmergenze.vue'
import TabellaUtenti from '@/components/Tabelle/TabellaUtenti.vue'
import Toast from '@/components/Toast/Toast.vue'
import TabellaSegnalazioni from '@/components/Tabelle/TabellaSegnalazioni.vue'

const route = useRoute()

const countCitizens = ref(0)
const countOperators = ref(0)
const countReports = ref(0)
const countEmergencies = ref(0)

const showToast = ref(false)
const toastType = ref()
const toastTitle = ref()
const toastMsg = ref()

onMounted(async () => {
    if (route.query.published === 'true') {
        createToast("success", "Successo!", "Comunicazione pubblicata correttamente")
    }
    
    if (route.query.published === 'true') {
        createToast("success", "Successo!", "Comunicazione modificata correttamente")
    }

    if (route.query.approved === 'true') {
        createToast("info", "Successo!", "Segnalazione approvata correttamente")
    }

    if (route.query.rejected === 'true') {
        createToast("info", "Successo!", "Segnalazione rifiutata correttamente")
    }

    getUsers()
    getReports()
    getEmergencies()

    countCitizens.value = await nUsers("citizen")
    countOperators.value = await nUsers("operator")
    countReports.value = await nReports()
    countEmergencies.value = await nEmergencies()
});

function calcolaPercentuale(value, total) {
    return total > 0 ? ((value / total) * 100).toFixed(2) + '%' : 'N/A';
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
        <Toast v-if="showToast" :type="toastType" :title="toastTitle" :msg="toastMsg" />

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
                        <div class="stat-value">{{ countCitizens }}</div>
                        <div class="stat-desc">
                            {{ calcolaPercentuale(countCitizens, users.length) }}
                        </div>
                    </div>
                    <div class="stat">
                        <div class="stat-figure text-ghost">
                            <UserPlusIcon class="inline-block size-12" />
                        </div>
                        <div class="stat-title">Operatori comunali</div>
                        <div class="stat-value">{{ countOperators }}</div>
                        <div class="stat-desc">
                            {{ calcolaPercentuale(countOperators, users.length) }}
                        </div>
                    </div>
                    <div class="stat">
                        <div class="stat-figure text-warning">
                            <ShieldExclamationIcon class="inline-block size-12" />
                        </div>
                        <div class="stat-title">Segnalazioni inviate</div>
                        <div class="stat-value">{{ countReports }}</div>
                        <div class="stat-desc">
                            {{ calcolaPercentuale(countReports, countReports + countEmergencies) }}
                        </div>
                    </div>
                    <div class="stat">
                        <div class="stat-figure text-primary">
                            <ShieldCheckIcon class="inline-block size-12" />
                        </div>
                        <div class="stat-title">Emergenze pubblicate</div>
                        <div class="stat-value">{{ countEmergencies }}</div>
                        <div class="stat-desc">
                            {{ calcolaPercentuale(countEmergencies, countReports + countEmergencies) }}
                        </div>
                    </div>
                </div>

                <div class="divider my-8"></div>

                <div role="tablist" class="tabs tabs-lifted tabs-lg">
                    <input type="radio" name="tab-admin" role="tab" class="tab me-2" aria-label="Utenti"
                        checked="checked" />
                    <div role="tabpanel" class="tab-content border-green-950 rounded-box p-6">
                        <h4 class="text-white font-bold text-2xl mb-4">Operatori comunali:</h4>
                        <TabellaUtenti :users="users" />
                        <h4 class="text-white font-bold text-2xl mt-8 mb-4">Cittadini:</h4>
                        <TabellaUtenti :users="users" :deletable="true" />
                    </div>

                    <input type="radio" name="tab-admin" role="tab" class="tab me-2" aria-label="Segnalazioni" />
                    <div role="tabpanel" class="tab-content border-green-950 rounded-box p-6">
                        <h4 class="text-white font-bold text-2xl mb-4">Segnalazioni in attesa:</h4>
                        <TabellaSegnalazioni :reports="reports" :is-operator="true" :reviewable="true" :pending-only="true" />
                        <h4 class="text-white font-bold text-2xl mt-8 mb-4">Segnalazioni approvate/rifiutate:</h4>
                        <TabellaSegnalazioni :reports="reports" :is-operator="true" :reviewable="false" :non-pending-only="true"  />
                    </div>

                    <input type="radio" name="tab-admin" role="tab" class="tab me-2" aria-label="Comunicazioni" />
                    <div role="tabpanel" class="tab-content border-green-950 rounded-box p-6">
                        <h4 class="text-white font-bold text-2xl mb-4">Comunicazioni pubblicate:</h4>
                        <TabellaEmergenze :emergencies="emergencies" :is-operator="true" />
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
    overflow: hidden;
}

.stat {
    transition: color 0.5s ease-in-out, transform 0.3s ease-in-out;
}

.stat:hover {
    color: var(--primary) !important;
    transform: scale(1.05);
}

.tab {
    background-color: var(--background);
}

.tabs-lifted>.tab:is(input:checked) {
    background-color: var(--secondary);
}

.tab-content {
    background-color: var(--background);
    border-radius: 0px 20px 20px 20px;
}
</style>
