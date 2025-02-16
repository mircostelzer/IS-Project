<script setup>
const props = defineProps({
    role: {
        type: String,
        required: false,
        default: "unknown"
    }
});
</script>

<template>
    <div v-if="props.role === 'citizen' || props.role === 'cittadino'" class="badge badge-secondary">Cittadino</div>
    <div v-else-if="props.role === 'operator' || props.role === 'operatore'" class="badge badge-info text-white">Operatore</div>
    <div v-else class="badge badge-ghost">Ruolo sconosciuto</div>
</template>

<style scoped>
.badge {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
</style>
