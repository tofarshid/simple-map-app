<script setup lang="ts">
import L from 'leaflet';
import { onBeforeUnmount, onMounted, ref, render } from 'vue';

/** Default center (Sydney–Parramatta area) */
const DEFAULT_LAT = -33.81315;
const DEFAULT_LNG = 151.00745;
const DEFAULT_ZOOM = 13;

const props = defineProps<{
  location: [number, number, string] | null;
}>();

const emit = defineEmits<{
  (event: 'map-click', payload: { lat: number; lng: number }): void;
}>();

let map: L.Map | null = null;
let locationsLayer: L.LayerGroup | null = null;
const handleMapClick = () => {};
const renderMarkers = () => {};

onMounted(() => {
  map = L.map('map-leaflet').setView([DEFAULT_LAT, DEFAULT_LNG], DEFAULT_ZOOM);
  locationsLayer = L.layerGroup().addTo(map);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors',
  }).addTo(map);

  map.on('click', handleMapClick);
  renderMarkers();
});

onBeforeUnmount(() => {
  if (map) {
    map.off('click', handleMapClick);
    if (locationsLayer) {
      locationsLayer.clearLayers();
      locationsLayer = null;
    }
    map.remove();
    map = null;
  }
});
</script>

<template>
  <div>
    <h2 class="h5 mb-3">Map</h2>
    <div id="map-leaflet" class="map-container"></div>
  </div>
</template>

<style scoped>
.map-container {
  width: 100%;
  min-height: 400px;
  z-index: 0;
}
</style>
