<script setup>
import {
    TrashIcon
} from "@heroicons/vue/24/solid";
import BadgeRuolo from "../Badge/BadgeRuolo.vue";
import { formatDate } from "@/data/validation";

const props = defineProps({
    users: {
        type: Array,
        required: true
    }
});

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
                    <th>Indirizzo mail</th>
                    <th class="hidden sm:table-cell">Ruolo</th>
                    <th class="hidden lg:table-cell">Creato il</th>
                    <th class="hidden xl:table-cell">Modificato il</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <transition-group name="fade">
                    <tr v-for="(user, index) in users" :key="index" class="hover fade-in"
                        :style="{ animationDelay: `${index * 0.05}s` }">
                        <td>
                            {{ index + 1 }}
                        </td>
                        <td>
                            {{ user.email }}
                        </td>
                        <td class="hidden sm:table-cell">
                            <BadgeRuolo :role="user.role" />
                        </td>
                        <td class="hidden lg:table-cell">
                            {{ formatDate(user.createdAt) }}
                        </td>
                        <td class="hidden xl:table-cell pe-12">
                            {{ formatDate(user.updatedAt) }}
                        </td>
                        <th class="px-1 size-0 pe-4">
                            <button @click="showModalElimina(user.id)"
                                class="btn btn-xs btn-error btn-square btn-outline"
                                :disabled="user.role === 'operator'">
                                <TrashIcon class="size-4 text-white opacity-80" />
                            </button>
                        </th>
                    </tr>
                </transition-group>
            </tbody>
        </table>

        <div v-for="(user, index) in users" :key="index">
            <dialog :id="`modalElimina${user.id}`" class="modal modal-bottom sm:modal-middle">
                <div class="modal-box">
                    <form method="dialog">
                        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>
                    <h3 class="text-lg font-bold mb-2">Eliminare questo utente?</h3>
                    <p class="text-sm text-gray-200"><b>ID:</b> {{ user.id }}</p>
                    <p class="text-sm text-gray-200 mb-4"><b>Indirizzo mail:</b> {{ user.email }}</p>
                    <button @click="eliminaUtente(user.id)" type="button"
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
