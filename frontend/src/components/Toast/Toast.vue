<script setup>
import {
    CheckCircleIcon,
    ExclamationTriangleIcon,
    XCircleIcon,
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

// Per caricare l'icona corretta in base al tipo
function caricaIcona(nomeIcona) {
    return listaIcone[nomeIcona];
}

const listaIcone = {
    success: CheckCircleIcon,
    warning: ExclamationTriangleIcon,
    error: XCircleIcon,
};
</script>

<template>
    <div class="toast">
        <div role="alert" :class="['alert', `alert-${props.type}`]" class="shadow-xl rounded-2xl">
            <component :is="caricaIcona(props.type)" class="text-black size-8" />
            <div class="pe-2">
                <h3 class="font-bold text-black">{{ props.title }}</h3>
                <div class="text-xs text-gray-900">{{ props.msg }}</div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
