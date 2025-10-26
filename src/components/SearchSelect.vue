<template>
  <div class="search-container">
    <p class="search-info">
      Seleciona um nome para localizar a cadeira
    </p>
    <select class="search-input"
            :value="modelValue"
            @change="$emit('update:modelValue', $event.target.value)">
      <option value="">Selecione um nome</option>
      <option v-for="name in uniqueNames" :key="name" :value="name">
        {{ name }}
      </option>
    </select>
  </div>
</template>

<script setup>
defineProps({
  modelValue: {type: String, default: ''},
  uniqueNames: {type: Array, default: () => []},
})
defineEmits(['update:modelValue'])
</script>

<style scoped>.search-container {
  text-align: center;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: 12px;
}

.search-info {
  font-family: 'Roboto', sans-serif;
  font-size: medium;
  color: grey;
  margin-bottom: 8px;
}

/* Wrapper for better control of select and arrow */
.search-input {
  /* reset of native arrow select*/
  -webkit-appearance: none;
  appearance: none;

  width: min(88vw, 400px);
  padding: 10px 42px 10px 14px;
  border-radius: 16px;
  border: 1px solid #3a3a3a;
  background-color: #0d0d0d;
  color: #eaeaea;
  font-size: 16px;
  line-height: 1.3;
  text-align: center;
  text-align-last: center;
  -moz-text-align-last: center; /* Firefox */
  /* arrow custom (SVG inline background) */
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='%23b3b3b3' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'/></svg>");
  background-repeat: no-repeat;
  background-position: right 14px center;
  background-size: 18px 18px;

  outline: none;
  transition: box-shadow .2s ease, border-color .2s ease, background-color .2s ease;
}

.search-input:focus {
  border-color: #7d7d7d;
  box-shadow: 0 0 0 4px #FFFFFF0F;
  background-color: #121212;
}

/* Remove highlight azul em Android */
.search-input:focus {
  -webkit-tap-highlight-color: transparent;
}

/* Mobile tweaks */
@media (max-width: 768px) and (orientation: landscape) {
  .search-info {
    font-size: 14px;
  }

  /* TODO verificar também o landscape */
  .search-input {
    width: min(88vw, 350px);
    padding: 8px 40px 8px 12px;

  }
}
</style>