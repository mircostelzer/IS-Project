<script setup>
import { ref, onMounted } from 'vue';
import { LMap, LTileLayer, LMarker, LPolygon } from "@vue-leaflet/vue-leaflet";

// Proprietà varie della mappa Leaflet
const url = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const zoom = ref(14);
const center = ref([46.0625, 11.125]);
const attribution = 'Progetto Ocio, 2024/2025';

const bordiTrento = ref([]);
const coloreBordi = "#009600";
const coloreFill = "#009600";
const opacitaFill = 0.1;

const markerDiProva = [46.0625, 11.125];

onMounted(() => {
    // Recupero i bordi del comune di Trento da OpenStreetMap
    fetch('https://nominatim.openstreetmap.org/search.php?city=Trento&polygon_geojson=1&format=json')
        .then(response => response.json())
        .then(data => {
            if (data.length > 0 && data[0].geojson && data[0].geojson.coordinates) {
                bordiTrento.value = data[0].geojson.coordinates[0].map(coord => [coord[1], coord[0]]);
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
});
</script>

<template>
    <div class="w-full h-full m-0 p-0 z-40">
        <l-map :zoom="zoom" :center="center">
            <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
            <l-marker :lat-lng="markerDiProva"></l-marker>
            <l-polygon v-if="bordiTrento.length" :lat-lngs="bordiTrento" :color="coloreBordi" :fill-color="coloreFill" :fill-opacity="opacitaFill"></l-polygon>
        </l-map>
    </div>
</template>

<style scoped></style>
