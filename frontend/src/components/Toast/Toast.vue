<script setup>
import { computed } from 'vue';

import {
    CheckCircleIcon,
    ExclamationTriangleIcon,
    XCircleIcon,
    InformationCircleIcon,
} from "@heroicons/vue/24/solid";

const props = defineProps({
    type: {
        type: String,
        required: false,
        default: "secondary"
    },
    title: {
        type: String,
        required: true
    },
    msg: {
        type: String,
        required: false
    }
});
</script>

<template>
    <div v-if="props.type === 'success'" class="toast">
        <div role="alert" class="alert alert-success rounded-xl shadow-lg">
            <CheckCircleIcon class="text-white size-8" />
            <div class="pe-2">
                <h3 class="font-bold text-white">{{ props.title }}</h3>
                <div class="text-xs text-gray-200">{{ props.msg }}</div>
            </div>
        </div>
    </div>
    <div v-else-if="props.type === 'warning'" class="toast">
        <div role="alert" class="alert alert-warning rounded-xl shadow-lg">
            <ExclamationTriangleIcon class="text-black size-8" />
            <div class="pe-2">
                <h3 class="font-bold text-black">{{ props.title }}</h3>
                <div class="text-xs text-gray-900">{{ props.msg }}</div>
            </div>
        </div>
    </div>
    <div v-else-if="props.type === 'error'" class="toast">
        <div role="alert" class="alert alert-error rounded-xl shadow-lg">
            <XCircleIcon class="text-black size-8" />
            <div class="pe-2">
                <h3 class="font-bold text-black">{{ props.title }}</h3>
                <div class="text-xs text-gray-900">{{ props.msg }}</div>
            </div>
        </div>
    </div>
    <div v-else class="toast">
        <div role="alert" class="alert alert-ghost rounded-xl shadow-lg">
            <InformationCircleIcon class="text-info size-8" />
            <div class="pe-2">
                <h3 class="font-bold text-white">{{ props.title }}</h3>
                <div class="text-xs text-gray-200">{{ props.msg }}</div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.toast {
    z-index: 80;
}
</style>
