<script setup>
</script>

<template>
    <div class="to-center max-height w-full">
        <div class="container flex flex-col justify-center text-center">
            <p class="text-6xl">404</p>
            <p class="mb-8">Nessuna pagina trovata!</p>
            <RouterLink to="/">
                <button class="btn btn-primary">Ritorna alla home</button>
            </RouterLink>
        </div>
    </div>
</template>

<style scoped>
.container {
    width: min(400px, 100%);
    height: min(300px, 100%);
    margin: 10px;
    border-radius: 10px;
    background-color: var(--background);
}
</style>
