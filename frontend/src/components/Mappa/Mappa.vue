<script>
import { LMap, LTileLayer, LMarker } from "@vue-leaflet/vue-leaflet";

export default {
    components: {
        LMap,
        LTileLayer,
        LMarker
    },
    data() {
        return {
            url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            attribution:
                '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors',
            zoom: 14,
            center: [46.0625, 11.125],
            markerLatLng: [46.0625, 11.125]
        };
    },
    mounted() {
        
    }
}
</script>

<template>
    <div class="w-full h-full m-0 p-0">
        <l-map :zoom="zoom" :center="center">
            <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
            <l-marker :lat-lng="markerLatLng"></l-marker>
        </l-map>
    </div>
</template>

<style scoped></style>
