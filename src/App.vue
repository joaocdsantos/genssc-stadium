<template>
  <Bench />
  <Analytics />
  <Footer />
</template>

<script setup>
import { Analytics } from '@vercel/analytics/vue';
import Bench from './components/Bench.vue';
import Footer from './components/Footer.vue'
</script>

<style>
html,
body,
#app {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

#app {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>