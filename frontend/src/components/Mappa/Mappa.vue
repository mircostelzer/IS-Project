<script setup>
import { ref, onMounted } from 'vue'
import { loggedUser } from '../../states/loggedUser.js'

import { LMap, LTileLayer, LMarker, LPopup, LPolygon } from "@vue-leaflet/vue-leaflet"
import { ChevronDoubleRightIcon, ExclamationTriangleIcon } from '@heroicons/vue/24/solid'

// Proprietà varie della mappa Leaflet
const url = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
const zoom = ref(14)
const center = ref([46.0625, 11.125])
const attribution = 'Progetto Ocio, 2024/2025'
const bordiTrento = ref([])
const coloreBordi = "#009600"
const coloreFill = "#009600"
const opacitaFill = 0.1

const props = defineProps({
    emergencies: {
        type: Array,
        required: false
    },
});

const filteredEmergencies = ref([])

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
            console.error('Errore caricamento mappa:', error);
        });

    filteredEmergencies.value = props.emergencies?.filter(emergency => {
        return emergency.coordinates.lat !== null &&
            emergency.coordinates.lon !== null;
    })
});
</script>

<template>
    <div class="map-div w-full h-full m-0 p-0 z-40">
        <l-map :zoom="zoom" :center="center">
            <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
            <l-marker v-for="marker in filteredEmergencies" :key="marker.id"
                :lat-lng="[marker.coordinates.lat, marker.coordinates.lon]">
                <l-popup>
                    <div class="flex justify-start">
                        <span class="indicator-item badge badge-success badge-sm mt-0.5 me-2"></span>
                        <h3 class="marker-title text-lg font-bold">{{ marker.title }}</h3>
                    </div>
                    <p class="marker-location">{{ marker.location }}</p>
                    <router-link :to="`/dettagli?id=${marker.id}`">
                        <button class="btn btn-block btn-sm btn-info text-white">
                            <ChevronDoubleRightIcon class="size-4 opacity-80 -mx-0.5" />
                            Espandi
                        </button>
                    </router-link>
                </l-popup>
            </l-marker>
            <l-polygon v-if="bordiTrento.length" :lat-lngs="bordiTrento" :color="coloreBordi" :fill-color="coloreFill"
                :fill-opacity="opacitaFill"></l-polygon>
        </l-map>

        <router-link v-if="loggedUser.token && loggedUser.role === 'citizen'" to="/invia_segnalazione">
            <button class="btn-segnalazione btn btn-warning btn-md">
                <ExclamationTriangleIcon class="size-8" />
                Segnala!
            </button>
        </router-link>
    </div>
</template>

<style scoped>
.map-div {
    position: relative;
}

.marker-title {
    font-family: "Inter", sans-serif;
    margin-top: -3px;
    line-height: 1.4;
}

.marker-location {
    margin-top: 3px;
}

.btn-segnalazione {
    position: absolute;
    bottom: 27px;
    right: 10px;
    z-index: 500;
}
</style>
