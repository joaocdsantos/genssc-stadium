<template>
  <div v-if="visible" class="modal">
    <div class="modal-content">
      <div class="image-container">
        <img src="../assets/logo.png" alt="Logotipo do Gens Sport Clube"/>
      </div>

      <p class="sponsor-info">
        <span class="sponsor-name">
          {{ chair.sponsor_name }}
          <i class="fa fa-star"></i>
        </span>
      </p>

      <p>Secção: <strong>{{ chair.section }}</strong></p>
      <p>Fila: <strong>{{ chair.row }}</strong></p>
      <p>Lugar: <strong>{{ chair.seat }}</strong></p>

      <button @click="$emit('close')" class="modal-close">OK</button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  visible: { type: Boolean, default: false },
  chair: { type: Object, default: () => ({}) }
})
defineEmits(['close'])
</script>

<style scoped>
.modal {
  position: fixed;
  z-index: 100;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  text-align: center;
  font-family: 'Roboto', sans-serif;
  background-color: #fefefe;
  padding: 20px;
  border-radius: 5px;
  width: 300px;
  position: relative;
}

.sponsor-info {
  font-weight: bold;
  font-size: 16px;
  margin: 10px 0;
}

.sponsor-name {
  font-weight: bold;
  color: #333;
  display: inline-flex;
  align-items: center;
}

.sponsor-name i {
  color: gold;
  margin-left: 5px;
}

.modal-close {
  background-color: #4CAF50;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  position: absolute;
  bottom: 10px;
  right: 10px;
}
.modal-close:hover {
  background-color: #45a049;
}
.image-container {
  margin: 20px 0;
}
.image-container img {
  width: 25%;
  height: auto;
  display: block;
  margin: 0 auto;
}
</style>