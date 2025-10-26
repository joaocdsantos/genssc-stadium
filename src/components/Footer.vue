<template>
  <footer class="copyright-container">
    <p class="copyright-text">
      Gens Sport Clube © {{ currentYear }}
      <br>
      Todos os direitos reservados
    </p>
  </footer>
</template>

<script setup>
/** Get current year */
const currentYear = new Date().getFullYear()
</script>

<style scoped>

.copyright-container {
  text-align: center;
  position: fixed;
  bottom: 3%;
  width: 100%;
  background-color: black;
}

.copyright-text{
  font-family: 'Roboto', sans-serif;
  font-size: smaller;
  color: grey;
}

@media (max-width: 768px) {
  .copyright-text{
    font-family: 'Roboto', sans-serif;
    font-size: xx-small;
    color: grey;
  }
}
</style>