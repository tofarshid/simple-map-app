<script setup lang="ts">
import { useStore } from 'vuex'
import type { State } from './store'

const store = useStore<State>()
</script>

<template>
  <div class="d-flex flex-column min-vh-100">
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
      <div class="container">
        <span class="navbar-brand mb-0 h1">Simple Map App</span>
      </div>
    </nav>

    <main class="container py-5 flex-grow-1">
      <div class="card shadow-sm">
        <div class="card-body">
          <h2 class="card-title h5">Vue + Vuex + TypeScript + Bootstrap</h2>
          <p class="card-text text-body-secondary mb-3">
            Skeleton store counter (replace with your map state and actions).
          </p>
          <p class="mb-3">
            Count: <strong>{{ store.state.count }}</strong>
          </p>
          <button type="button" class="btn btn-primary" @click="store.commit('increment')">
            Increment
          </button>
        </div>
      </div>
    </main>
  </div>
</template>
