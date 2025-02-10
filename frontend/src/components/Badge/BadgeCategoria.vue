<script setup>
const props = defineProps({
    category: {
        type: String,
        required: true
    }
});
</script>

<template>
    <div class="badge">{{ props.category }}</div>
</template>

<style scoped>
</style>
