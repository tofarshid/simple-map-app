<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import type { RootState, Marker } from './store';

import AppFooter from './components/AppFooter.vue';
import AppHeader from './components/AppHeader.vue';
import MapCard from './components/MapCard.vue';
import MarkerList from './components/MarkerList.vue';

// init
const store = useStore<RootState>();
const markers = computed(() => store.state.markers);
const loading = computed(() => store.state.loading);
const error = computed(() => store.state.error);
const markerCount = computed(() => store.getters.markerCount as number);
const mapRef = ref<InstanceType<typeof MapCard> | null>(null);

// fn
const handleMapClick = async ({ lat, long }: { lat: number; long: number }) =>
  await store.dispatch('saveMarker', { lat, long });
const flyToMarker = (marker: Marker) =>
  mapRef.value?.flyToMarker(marker.id, marker.lat, marker.long);

// hook
onMounted(async () => await store.dispatch('getMarkers'));
</script>

<template>
  <div class="d-flex flex-column min-vh-100">
    <AppHeader />
    <main class="container py-5 py-5">
      <section class="row g-4">
        <div class="col-12 col-lg-6">
          <MapCard ref="mapRef" :markers="markers" @map-click="handleMapClick" />
        </div>
        <div class="col-12 col-lg-6">
          <MarkerList
            :markers="markers"
            :marker-count="markerCount"
            :loading="loading"
            :error="error"
            @select="flyToMarker"
          />
        </div>
      </section>
    </main>
    <AppFooter />
  </div>
</template>
