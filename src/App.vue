<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import type { RootState, Location } from './store';

import AppFooter from './components/AppFooter.vue';
import AppHeader from './components/AppHeader.vue';
import MapCard from './components/MapCard.vue';
import MarkerList from './components/MarkerList.vue';

// init
const store = useStore<RootState>();
const locations = computed(() => store.state.locations);
const loading = computed(() => store.state.loading);
const error = computed(() => store.state.error);
const locationCount = computed(() => store.getters.locationCount as number);
const mapRef = ref<InstanceType<typeof MapCard> | null>(null);

// fn
const handleMapClick = async ({ lat, long }: { lat: number; long: number }) =>
  await store.dispatch('saveLocation', { lat, long });
const flyToLocation = (location: Location) =>
  mapRef.value?.flyToLocation(location.id, location.lat, location.long);

// hook
onMounted(async () => await store.dispatch('getLocations'));
</script>

<template>
  <div class="d-flex flex-column min-vh-100">
    <AppHeader />
    <main class="container py-5 py-5">
      <section class="row g-4">
        <div class="col-12 col-lg-6">
          <MapCard ref="mapRef" :locations="locations" @map-click="handleMapClick" />
        </div>
        <div class="col-12 col-lg-6">
          <MarkerList
            :locations="locations"
            :location-count="locationCount"
            :loading="loading"
            :error="error"
            @select="flyToLocation"
          />
        </div>
      </section>
    </main>

    <AppFooter />
  </div>
</template>
