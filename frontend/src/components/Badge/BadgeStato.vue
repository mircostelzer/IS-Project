<script setup>
const props = defineProps({
    state: {
        type: String,
        required: true
    }
});
</script>

<template>
    <div v-if="props.state && (props.state === 'in_progress' || props.state === 'In corso')" class="badge badge-success badge-md">In corso</div>
    <div v-else-if="props.state && (props.state === 'ended' || props.state === 'Terminato')" class="badge badge-error badge-md">Terminato</div>
    <div v-else class="badge badge-secondary text-sm">Stato sconosciuto</div>
</template>

<style scoped>
</style>
