<script setup>
const props = defineProps({
    category: {
        type: String,
        required: true
    }
});
</script>

<template>
    <div class="badge text-sm">{{ props.category }}</div>
</template>

<style scoped>
</style>
