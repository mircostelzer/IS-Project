<script setup>
import {
    EyeIcon,
    Cog6ToothIcon,
    TrashIcon
} from "@heroicons/vue/24/solid";
import BadgeCategoria from "../Badge/BadgeCategoria.vue";
import BadgeStato from "../Badge/BadgeStato.vue";

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

// Funzione per recuperare l'id delle emergenze
const getEmergencyId = (self) => {
    return self.substring(self.lastIndexOf('/') + 1);
};

function showModalElimina(id) {
    const modal = document.getElementById('modalElimina' + id);
    if (modal) modal.showModal();
}
</script>

<template>
    <div class="overflow-x-auto md:overflow-y-auto">
        <table class="table table-sm table-zebra table-pin-rows">
            <thead>
                <tr class="text-white">
                    <th>#</th>
                    <th>Titolo</th>
                    <th class="hidden sm:table-cell">Categoria</th>
                    <th class="hidden sm:table-cell">Stato</th>
                    <th class="hidden sm:table-cell">Luogo</th>
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
                        <td class="hidden sm:table-cell">
                            <BadgeCategoria :category="emergency.category" />
                        </td>
                        <td class="hidden sm:table-cell">
                            <BadgeStato :state="emergency.state" />
                        </td>
                        <td class="hidden sm:table-cell pe-12">{{ emergency.location }}</td>
                        <th :class="{ 'px-1 size-0': true, 'pe-4': !props.isOperator }">
                            <router-link :to="`/dettagli?id=${getEmergencyId(emergency.self)}`">
                                <button class="btn btn-xs btn-info btn-square btn-outline">
                                    <EyeIcon class="size-4 text-white opacity-80" />
                                </button>
                            </router-link>
                        </th>
                        <th v-if="props.isOperator" class="px-1 size-0">
                            <router-link :to="`/modifica_comunicazione?id=${getEmergencyId(emergency.self)}`">
                                <button class="btn btn-xs btn-info btn-square btn-outline">
                                    <Cog6ToothIcon class="size-4 text-white opacity-80" />
                                </button>
                            </router-link>
                        </th>
                        <th v-if="props.isOperator" class="px-1 size-0 pe-4">
                            <button @click="showModalElimina(getEmergencyId(emergency.self))"
                                class="btn btn-xs btn-error btn-square btn-outline">
                                <TrashIcon class="size-4 text-white opacity-80" />
                            </button>
                        </th>
                    </tr>
                </transition-group>
            </tbody>
        </table>

        <div v-for="(emergency, index) in emergencies" :key="index">
            <dialog :id="`modalElimina${getEmergencyId(emergency.self)}`" class="modal modal-bottom sm:modal-middle">
                <div class="modal-box">
                    <form method="dialog">
                        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>
                    <h3 class="text-lg font-bold mb-2">Eliminare questa emergenza?</h3>
                    <p class="text-sm text-gray-200"><b>ID:</b> {{ getEmergencyId(emergency.self) }}</p>
                    <p class="text-sm text-gray-200 mb-4"><b>Titolo:</b> {{ emergency.title }}</p>
                    <button @click="eliminaEmergenza(getEmergencyId(emergency.self))" type="button"
                        class="btn btn-error float-end">
                        <TrashIcon class="size-5 opacity-70" />
                        Conferma ed elimina
                    </button>
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
