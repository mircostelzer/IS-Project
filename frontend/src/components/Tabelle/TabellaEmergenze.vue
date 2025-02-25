<script setup>
import { ref } from "vue";
import { deleteEmergencyById } from "@/data/emergencies"

import {
    EyeIcon,
    Cog6ToothIcon,
    TrashIcon
} from "@heroicons/vue/24/solid";
import BadgeCategoria from "../Badge/BadgeCategoria.vue";
import BadgeStato from "../Badge/BadgeStato.vue";
import Toast from "../Toast/Toast.vue";

const props = defineProps({
    emergencies: {
        type: Array,
        required: true
    },
    isOperator: {
        type: Boolean,
        required: false,
        default: false
    },
});

function showModalElimina(id) {
    const modal = document.getElementById('modalElimina' + id);
    if (modal) modal.showModal();
}

function eliminaEmergenza(id) {
    deleteEmergencyById(id);
    const modal = document.getElementById('modalElimina' + id);
    if (modal) modal.close();
    createToast("info", "Successo", "Emergenza eliminata correttamente");
}

const showToast = ref(false)
const toastType = ref()
const toastTitle = ref()
const toastMsg = ref()

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
    <Toast v-if="showToast" :type="toastType" :title="toastTitle" :msg="toastMsg" />

    <div class="overflow-x-auto md:overflow-y-auto">
        <div v-if="emergencies.length === 0" class="text-center w-full my-4 italic">
            Nessun risultato disponibile
        </div>
        <table v-else class="table table-sm table-zebra table-pin-rows">
            <thead>
                <tr class="text-white">
                    <th>#</th>
                    <th>Titolo</th>
                    <th class="hidden lg:table-cell">Categoria</th>
                    <th class="hidden sm:table-cell">Stato</th>
                    <th class="hidden lg:table-cell">Luogo</th>
                    <th></th>
                    <th v-if="props.isOperator"></th>
                    <th v-if="props.isOperator"></th>
                </tr>
            </thead>
            <tbody>
                <transition-group name="fade">
                    <tr v-for="(emergency, index) in emergencies" :key="index" class="hover fade-in"
                        :style="{ animationDelay: `${index * 0.05}s` }">
                        <td>
                            {{ index + 1 }}
                        </td>
                        <td>
                            {{ emergency.title }}
                        </td>
                        <td class="hidden lg:table-cell">
                            <BadgeCategoria :category="emergency.category" />
                        </td>
                        <td class="hidden sm:table-cell">
                            <BadgeStato :state="emergency.state" />
                        </td>
                        <td class="hidden lg:table-cell pe-12">{{ emergency.location }}</td>
                        <th :class="{ 'px-1 size-0': true, 'pe-4': !props.isOperator }">
                            <router-link :to="`/dettagli?id=${emergency.id}`">
                                <button class="btn btn-xs btn-info btn-square btn-outline">
                                    <EyeIcon class="size-4 text-white opacity-80" />
                                </button>
                            </router-link>
                        </th>
                        <th v-if="props.isOperator" class="px-1 size-0">
                            <router-link :to="`/modifica_comunicazione?id=${emergency.id}`">
                                <button class="btn btn-xs btn-info btn-square btn-outline">
                                    <Cog6ToothIcon class="size-4 text-white opacity-80" />
                                </button>
                            </router-link>
                        </th>
                        <th v-if="props.isOperator" class="px-1 size-0 pe-4">
                            <button @click="showModalElimina(emergency.id)"
                                class="btn btn-xs btn-error btn-square btn-outline">
                                <TrashIcon class="size-4 text-white opacity-80" />
                            </button>
                        </th>
                    </tr>
                </transition-group>
            </tbody>
        </table>

        <div v-for="(emergency, index) in emergencies" :key="index">
            <dialog :id="`modalElimina${emergency.id}`" class="modal modal-bottom sm:modal-middle">
                <div class="modal-box">
                    <form method="dialog">
                        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>
                    <h3 class="text-lg font-bold mb-2">Eliminare questa emergenza?</h3>
                    <p class="text-sm text-gray-200"><b>ID:</b> {{ emergency.id }}</p>
                    <p class="text-sm text-gray-200 mb-4"><b>Titolo:</b> {{ emergency.title }}</p>
                    <div class="modal-action">
                        <form method="dialog">
                            <button @click="eliminaEmergenza(emergency.id)" type="button"
                                class="btn btn-error float-end">
                                <TrashIcon class="size-5 opacity-70" />
                                Conferma ed elimina
                            </button>
                            <button class="btn btn-ghost btn-outline me-2">Annulla</button>
                        </form>
                    </div>
                </div>
                <form method="dialog" class="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>
        </div>
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
