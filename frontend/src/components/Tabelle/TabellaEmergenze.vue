<script setup>
import {
    EyeIcon,
    Cog6ToothIcon,
    TrashIcon
} from "@heroicons/vue/24/solid";
import BadgeCategoria from "../Badge/BadgeCategoria.vue";
import BadgeStato from "../Badge/BadgeStato.vue";

// Funzione per recuperare l'id delle emergenze
const getEmergencyId = (self) => {
    return self.substring(self.lastIndexOf('/') + 1);
};

const props = defineProps({
    emergencies: {
        type: Array,
        required: true
    }
});
</script>

<template>
    <div class="overflow-x-auto md:overflow-y-auto">
        <table class="table table-sm table-zebra table-pin-rows">
            <thead>
                <tr class="text-white">
                    <th>#</th>
                    <th>Titolo</th>
                    <th>Categoria</th>
                    <th>Stato</th>
                    <th>Luogo</th>
                    <th></th>
                    <th></th>
                    <th></th>
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
                        <td>
                            <BadgeCategoria :category="emergency.category" class="badge-sm" />
                        </td>
                        <td>
                            <BadgeStato :state="emergency.state" class="badge-sm" />
                        </td>
                        <td class="pe-12">{{ emergency.location }}</td>
                        <th class="px-1 size-0">
                            <router-link :to="`/dettagli?id=${getEmergencyId(emergency.self)}`">
                                <button class="btn btn-xs btn-info btn-square btn-outline">
                                    <EyeIcon class="size-4 text-white opacity-80" />
                                </button>
                            </router-link>
                        </th>
                        <th class="px-1 size-0">
                            <button class="btn btn-xs btn-info btn-square btn-outline">
                                <Cog6ToothIcon class="size-4 text-white opacity-80" />
                            </button>
                        </th>
                        <th class="px-1 size-0 pe-4">
                            <button class="btn btn-xs btn-error btn-square btn-outline">
                                <TrashIcon class="size-4 text-white opacity-80" />
                            </button>
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
