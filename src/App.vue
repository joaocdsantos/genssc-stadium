<template>
  <div id='app'>
  <ChairBench/>
  <Analytics/>
  </div>
</template>

<script>
import {Analytics} from '@vercel/analytics/vue';
import ChairBench from './components/Bench.vue';


export default {
  name: 'App',
  components: {
    ChairBench,
    Analytics
  }
}
</script>

<style>
html, body, #app {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden; /* Garante que o conteúdo não cause scroll */
}

#app {
  display: flex;
  flex-direction: column;
  align-items: center; /* Centraliza o conteúdo */
  justify-content: center; /* Centraliza o conteúdo verticalmente */
}
</style>