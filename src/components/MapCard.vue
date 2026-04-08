<script setup lang="ts">
import L from 'leaflet';
import { onBeforeUnmount, onMounted, watch } from 'vue';
import type { Marker } from '../store';

/** Default center (Sydney–Parramatta area) */
const DEFAULT_LAT = -33.81315;
const DEFAULT_LNG = 151.00745;
const DEFAULT_ZOOM = 13;

const props = defineProps<{
  markers: Marker[];
}>();

const emit = defineEmits<{
  (event: 'map-click', payload: { lat: number; long: number }): void;
}>();

let map: L.Map | null = null;
let markersLayer: L.LayerGroup | null = null;

const handleMapClick = (event: L.LeafletMouseEvent) => {
  const lat = Number(event.latlng.lat.toFixed(6));
  const long = Number(event.latlng.lng.toFixed(6));

  emit('map-click', { lat, long });
};

const renderMarkers = () => {
  if (!map || !markersLayer) return;
  markersLayer.clearLayers();

  for (const marker of props.markers) {
    L.marker([marker.lat, marker.long])
      .addTo(markersLayer)
      .bindPopup(`(${marker.id}) ${marker.lat}, ${marker.long}`);
  }
};

const flyToMarker = (id: number, lat: number, long: number) => {
  if (!map) return;
  map.flyTo([lat, long], 15, { duration: 1.2 });

  if (!markersLayer) return;
  markersLayer.eachLayer((layer) => {
    if (!(layer instanceof L.Marker)) return;
    const markerLatLng = layer.getLatLng();

    if (markerLatLng.lat === lat && markerLatLng.lng === long) {
      layer.bindPopup(`(${id}) ${lat}, ${long}`).openPopup();
    }
  });
};

defineExpose({
  flyToMarker,
});

onMounted(() => {
  map = L.map('map-leaflet').setView([DEFAULT_LAT, DEFAULT_LNG], DEFAULT_ZOOM);
  markersLayer = L.layerGroup().addTo(map);

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
    if (markersLayer) {
      markersLayer.clearLayers();
      markersLayer = null;
    }
    map.remove();
    map = null;
  }
});

watch(
  () => props.markers,
  () => {
    renderMarkers();
  },
  { deep: true },
);
</script>

<template>
  <div class="card shadow-sm">
    <div class="card-body">
      <h2 class="h5 mb-3">Map</h2>
      <div id="map-leaflet" class="map-container"></div>
    </div>
  </div>
</template>

<style scoped>
.map-container {
  width: 100%;
  min-height: 400px;
  z-index: 0;
}
</style>
