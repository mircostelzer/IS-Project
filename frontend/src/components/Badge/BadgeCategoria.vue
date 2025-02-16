<script setup>
const props = defineProps({
    category: {
        type: String,
        required: false,
        default: "unknown"
    }
});
</script>

<template>
    <div v-if="props.category !== 'unknown'" class="badge">{{ props.category }}</div>
    <div v-else class="badge badge-ghost">Categoria sconosciuta</div>
</template>

<style scoped>
.badge {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
</style>
