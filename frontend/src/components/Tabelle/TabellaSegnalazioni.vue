<script setup>
import { computed } from "vue";

import {
    ChevronDoubleRightIcon
} from "@heroicons/vue/24/solid";
import BadgeStatoReports from "../Badge/BadgeStatoReports.vue";

const props = defineProps({
    reports: {
        type: Array,
        required: true
    },
    isOperator: {
        type: Boolean,
        required: false,
        default: false
    },
    reviewable: {
        type: Boolean,
        required: false,
        default: false
    },
    pendingOnly: {
        type: Boolean,
        required: false,
        default: false
    },
    nonPendingOnly: {
        type: Boolean,
        required: false,
        default: false
    },
});

const filteredReports = computed(() => {
    if (props.pendingOnly) {
        return props.reports.filter(report => report.state === 'pending');
    } else if (props.nonPendingOnly) {
        return props.reports.filter(report => report.state !== 'pending');
    } else {
        return props.reports;
    }
});
</script>

<template>
    <div class="overflow-x-auto md:overflow-y-auto">
        <div v-if="filteredReports.length === 0" class="text-center w-full my-4 italic">
            Nessun risultato disponibile
        </div>
        <table v-else class="table table-sm table-zebra table-pin-rows">
            <thead>
                <tr class="text-white">
                    <th>#</th>
                    <th v-if="props.isOperator">Autore</th>
                    <th v-else>Inviata il</th>
                    <th class="hidden md:table-cell">Luogo</th>
                    <th>Stato</th>
                    <th v-if="props.reviewable"></th>
                </tr>
            </thead>
            <tbody>
                <transition-group name="fade">
                    <tr v-for="(report, index) in filteredReports" :key="index" class="hover fade-in"
                        :style="{ animationDelay: `${index * 0.05}s` }">
                        <td>
                            {{ index + 1 }}
                        </td>
                        <td v-if="props.isOperator">
                            {{ report.email }}
                        </td>
                        <td v-else>
                            {{ report.createdAt }}
                        </td>
                        <td class="hidden md:table-cell">
                            {{ report.location }}
                        </td>
                        <td>
                            <BadgeStatoReports :state="report.state" />
                        </td>
                        <th v-if="props.reviewable" class="px-1 pe-4 size-0">
                            <router-link :to="`/conferma_segnalazione?id=${report.id}`">
                                <button class="btn btn-xs btn-warning btn-square btn-outline">
                                    <ChevronDoubleRightIcon class="size-4 text-white opacity-80" />
                                </button>
                            </router-link>
                        </th>
                    </tr>
                </transition-group>
            </tbody>
        </table>
    </div>
</template>

<style scoped>
.fade-in {
    opacity: 0;
    transform: translateX(-25px);
    animation: fadeIn 0.3s ease-out forwards, transform 0.3s ease-out forwards;
}

@keyframes fadeIn {
    to {
        opacity: 1;
        transform: translateX(0);
    }
}
</style>
