<script setup lang="ts">
import L from 'leaflet';
import { onBeforeUnmount, onMounted, watch } from 'vue';
import { DEFAULT_MAP_LAT, DEFAULT_MAP_LNG, DEFAULT_MAP_ZOOM } from '../constants/map';
import type { Marker } from '../store';

// init
let map: L.Map | null = null;
let markersLayer: L.LayerGroup | null = null;

// props & emit
const props = defineProps<{
  markers: Marker[];
}>();

const emit = defineEmits<{
  (event: 'map-click', payload: { lat: number; long: number }): void;
}>();

// fn
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

// hooks
onMounted(() => {
  map = L.map('map-leaflet').setView([DEFAULT_MAP_LAT, DEFAULT_MAP_LNG], DEFAULT_MAP_ZOOM);
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

defineExpose({ flyToMarker });
</script>

<template>
  <div class="card shadow-sm">
    <div class="card-body">
      <h2 class="h5 mb-3">Map</h2>
      <div id="map-leaflet" class="map-container"></div>
    </div>
  </div>
</template>

<style scoped src="../styles/MapCard.css"></style>
