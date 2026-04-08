<script setup lang="ts">
import type { Marker } from '../store';

defineProps<{
  markers: Marker[];
  markerCount: number;
  loading: boolean;
  error: string | null;
}>();

const emit = defineEmits<{
  select: [marker: Marker];
}>();
</script>

<template>
  <div class="card shadow-sm">
    <div class="card-body">
      <h2 class="h5 mb-3">Marker History | Count: {{ markerCount }}</h2>
      <p v-if="loading" class="text-muted">Loading...</p>
      <p v-if="error" class="text-danger">Error: {{ error }}</p>
      <ul class="marker-list scroll ps-0">
        <li
          v-for="marker in markers"
          :key="marker.id"
          class="d-flex justify-content-between"
          role="button"
        >
          <a
            type="button"
            :title="` (${marker.lat}, ${marker.long})`"
            class="on-hover btn text-decoration-none text-start text-black ps-1"
            @click.prevent="emit('select', marker)"
            ><b>{{ marker.id + ': ' }}</b
            >{{ marker.address }}</a
          >
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped src="../styles/MarkerList.css"></style>
