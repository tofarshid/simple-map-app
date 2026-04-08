<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import AppFooter from './components/AppFooter.vue';
import AppHeader from './components/AppHeader.vue';
import type { RootState } from './store';
import MapCard from './components/MapCard.vue';

const store = useStore<RootState>();
const locations = computed(() => store.state.locations);
const loading = computed(() => store.state.loading);
const error = computed(() => store.state.error);
const locationCount = computed(() => store.getters.locationCount as number);
const mapRef = ref<InstanceType<typeof MapCard> | null>(null);

const handleMapClick = async ({ lat, long }: { lat: number; long: number }) => {
  await store.dispatch('saveLocation', { lat, long });
};

onMounted(async () => {
  await store.dispatch('getLocations');
});
</script>

<template>
  <div class="d-flex flex-column min-vh-100">
    <AppHeader />

    <main class="container py-5 py-5">
      <section class="row g-4">
        <div class="col-12 col-lg-6">
          <div class="card shadow-sm">
            <div class="card-body">
              <MapCard ref="mapRef" :locations="locations" @map-click="handleMapClick" />
            </div>
          </div>
        </div>
        <div class="col-12 col-lg-6">
          <div class="card shadow-sm">
            <div class="card-body">
              <h2 class="h5 mb-3">Marker History {{ locationCount }}</h2>
              <ul class="marker-list scroll">
                <li
                  v-for="location in locations"
                  :key="location.id"
                  class="d-flex justify-content-between"
                  role="button"
                >
                  <span>{{ JSON.stringify(location) }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>

    <AppFooter />
  </div>
</template>

<style scoped>
.marker-list.scroll {
  max-height: 400px;
  overflow-y: auto;
}
</style>
