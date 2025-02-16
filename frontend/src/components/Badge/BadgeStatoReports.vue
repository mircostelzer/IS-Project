<script setup>
const props = defineProps({
    state: {
        type: String,
        required: false,
        default: "unknown"
    }
});
</script>

<template>
    <div v-if="props.state === 'pending'" class="badge badge-warning badge-md">In attesa</div>
    <div v-else-if="props.state === 'approved'" class="badge badge-success badge-md">Approvata</div>
    <div v-else-if="props.state === 'rejected'" class="badge badge-error badge-md">Rifiutata</div>
    <div v-else class="badge badge-secondary text-sm">Stato sconosciuto</div>
</template>

<style scoped>
</style>
