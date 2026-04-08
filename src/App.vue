<script setup lang="ts">
import { ref } from 'vue'
import { useStore } from 'vuex'
import AppFooter from './components/AppFooter.vue'
import AppHeader from './components/AppHeader.vue'
import type { State } from './store'
import MapCard from './components/MapCard.vue'

const store = useStore<State>()

const mapRef = ref<InstanceType<typeof MapCard> | null>(null)
</script>

<template>
  <div class="d-flex flex-column min-vh-100">
    <AppHeader />

    <main class="container py-5 py-5">
      <section class="row g-4">
        <div class="col-12 col-lg-6">
          <div class="card shadow-sm">
            <div class="card-body">
              <MapCard ref="mapRef" :location="null" />
            </div>
          </div>
        </div>
        <div class="col-12 col-lg-6">
          <div class="card shadow-sm">
            <div class="card-body">LIST</div>
          </div>
        </div>
      </section>
    </main>

    <AppFooter />
  </div>
</template>
