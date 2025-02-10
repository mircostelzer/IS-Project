<script setup>
import { ref, onMounted } from 'vue'
import { loggedUser } from '../states/loggedUser.js'
import { users, getUsers } from '../data/users'
import { emergencies, getEmergencies } from '../data/emergencies'

import { LockClosedIcon, ShieldCheckIcon, ShieldExclamationIcon, UserIcon, UserPlusIcon } from "@heroicons/vue/24/solid"
import AccessDenied from '@/components/Error/AccessDenied.vue'
import AccessLimited from "@/components/Error/AccessLimited.vue"
import TabellaEmergenze from '@/components/Tabelle/TabellaEmergenze.vue'
import TabellaUtenti from '@/components/Tabelle/TabellaUtenti.vue'

const countCitizens = ref("N/A")
const countOperators = ref("N/A")
const countReports = ref("N/A")
const countEmergencies = ref("N/A")

const showToast = ref(false)
const toastType = ref()
const toastTitle = ref()
const toastMsg = ref()

onMounted(async () => {
    getEmergencies()
    getUsers()
    console.log(users)

    countCitizens.value = users.value.filter(user => user.role === 'citizen').length;
    countOperators.value = users.value.filter(user => user.role === 'operator').length;
    countReports.value = emergencies.value.filter(emergency => emergency.status === 'pending').length;
    countEmergencies.value = emergencies.value.filter(emergency => emergency.status === 'approved').length;
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
                        <div class="stat-desc">{{ calcolaPercentuale(countCitizens, users.length ) }}</div>
                    </div>
                    <div class="stat">
                        <div class="stat-figure text-ghost">
                            <UserPlusIcon class="inline-block size-12" />
                        </div>
                        <div class="stat-title">Operatori comunali</div>
                        <div class="stat-value">{{ countOperators }}</div>
                        <div class="stat-desc">{{ calcolaPercentuale(countOperators, users.length ) }}</div>
                    </div>
                    <div class="stat">
                        <div class="stat-figure text-accent">
                            <ShieldExclamationIcon class="inline-block size-12" />
                        </div>
                        <div class="stat-title">Segnalazioni in attesa</div>
                        <div class="stat-value">{{ countReports }}</div>
                        <div class="stat-desc">{{ calcolaPercentuale(countReports, emergencies.length ) }}</div>
                    </div>
                    <div class="stat">
                        <div class="stat-figure text-success">
                            <ShieldCheckIcon class="inline-block size-12" />
                        </div>
                        <div class="stat-title">Emergenze pubblicate</div>
                        <div class="stat-value">{{ countEmergencies }}</div>
                        <div class="stat-desc">{{ calcolaPercentuale(countEmergencies, emergencies.length ) }}</div>
                    </div>
                </div>

                <div class="divider my-8"></div>

                <div role="tablist" class="tabs tabs-lifted tabs-lg">
                    <input type="radio" name="tab-admin" role="tab" class="tab me-2" aria-label="Utenti"
                        checked="checked" />
                    <div role="tabpanel" class="tab-content border-green-950 rounded-box p-6">
                        <TabellaUtenti :users="users" />
                    </div>

                    <input type="radio" name="tab-admin" role="tab" class="tab me-2" aria-label="Segnalazioni" />
                    <div role="tabpanel" class="tab-content border-green-950 rounded-box p-6">
                        Segnalazioni
                    </div>

                    <input type="radio" name="tab-admin" role="tab" class="tab me-2" aria-label="Comunicazioni" />
                    <div role="tabpanel" class="tab-content border-green-950 rounded-box p-6">
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
}

.tab {
    background-color: var(--background);
}

.tabs-lifted > .tab:is(input:checked) {
    background-color: var(--secondary);
}

.tab-content {
    background-color: var(--background);
    border-radius: 0px 20px 20px 20px;
}
</style>
