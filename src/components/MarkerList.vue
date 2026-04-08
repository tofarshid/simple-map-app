<script setup lang="ts">
import type { Location } from '../store';

defineProps<{
  locations: Location[];
  locationCount: number;
  loading: boolean;
  error: string | null;
}>();

const emit = defineEmits<{
  select: [location: Location];
}>();
</script>

<template>
  <div class="card shadow-sm">
    <div class="card-body">
      <h2 class="h5 mb-3">Marker History | Count: {{ locationCount }}</h2>
      <p v-if="loading" class="text-muted">Loading...</p>
      <p v-if="error" class="text-danger">Error: {{ error }}</p>
      <ul class="marker-list scroll ps-0">
        <li
          v-for="location in locations"
          :key="location.id"
          class="d-flex justify-content-between"
          role="button"
        >
          <a
            type="button"
            :title="` (${location.lat}, ${location.long})`"
            class="on-hover btn text-decoration-none text-start text-black ps-1"
            @click.prevent="emit('select', location)"
            ><b>{{ location.id + ': ' }}</b
            >{{ location.address }}</a
          >
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped src="../styles/MarkerList.css"></style>
