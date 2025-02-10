<script setup>
const props = defineProps({
    role: {
        type: String,
        required: true
    }
});
</script>

<template>
    <div v-if="role === 'citizen'" class="badge badge-secondary">Cittadino</div>
    <div v-else-if="role === 'operator'" class="badge badge-info text-white">Operatore</div>
    <div v-else class="badge badge-ghost">Ruolo sconosciuto</div>
</template>

<style scoped>
.badge {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
</style>
