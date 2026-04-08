<script setup lang="ts">
const year = new Date().getFullYear();
</script>

<template>
  <footer class="mt-auto border-top bg-body-tertiary py-4">
    <div class="container">
      <div class="row align-items-center gy-2">
        <div class="col-md-6 text-center text-md-start">
          <span class="text-body-secondary small">&copy; {{ year }}</span>
        </div>
      </div>
    </div>
  </footer>
</template>
