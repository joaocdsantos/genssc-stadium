<template>
  <div class="main-container">


    <!-- 3D Scene - Three JS -->
    <div ref="threeContainer" class="three-container"></div>

    <!-- Search -->
    <div class="search-container">

      <!-- Logo -->
      <!--TODO - check if logo was necessary there
            <div class="image-container">
              <img src="../assets/gsc_logo_vector.png" alt="Logo vector Gens"/>
            </div>
       -->
      <!-- Search Input -->
      <input
          v-model="searchName"
          @input="searchSubject"
          placeholder="Pesquisar nome"
          class="search-input"
      >
    </div>

    <!-- Modal -->
    <div v-if="modalVisible" class="modal">
      <div class="modal-content">
        <div class="image-container">
          <img src="../assets/logo.png" alt="Logótipo do Gens Sport Clube"/>
        </div>
        <p class="sponsor-info">
          <span class="sponsor-name">
        {{ selectedChair.nome }}
        <i class="fa fa-star"></i>
      </span>
        </p>
        <p>Secção: <strong>{{ selectedChair.seccao }} </strong></p>
        <p>Fila: <strong>{{ selectedChair.fila }}</strong></p>
        <p>Lugar: <strong>{{ selectedChair.lugar }}</strong></p>
        <button @click="closeModal" class="modal-close">OK</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted, useTemplateRef, onBeforeUnmount} from 'vue';
import occupants from '../assets/data.json'

import {ThreeService} from '../services/ThreeService';

const searchName = ref('');
const modalVisible = ref(false);
const selectedChair = ref({})
const threeContainer = useTemplateRef('threeContainer')

let threeInstance;

onMounted(() => {
      threeInstance = new ThreeService(
          threeContainer.value,
          occupants,
          (seatInformation) => {
            selectedChair.value = seatInformation;
            modalVisible.value = true;
          },
      );
      threeInstance.init();
    });

onBeforeUnmount(() => {
  threeInstance?.dispose();
  threeInstance = null;
});

function searchSubject() {
  threeInstance?.highlightByName(searchName.value);
}

function closeModal() {
  modalVisible.value = false;
}
</script>

<style scoped>
.main-container {
  position: relative;
  width: 100%;
  height: 100vh;
}

.three-container {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}

.search-container {
  position: absolute;
  bottom: 10%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  width: 300px;
}

.search-input {
  width: 100%;
  padding: 10px 15px;
  font-size: 16px;
  border: 2px solid #ffffff;
  border-radius: 25px;
  background-color: rgba(0, 0, 0, 0.5);
  color: #000000;
  outline: none;
  transition: all 0.3s ease;
}

.search-input::placeholder {
  color: #ffffff;
}

.search-input:focus {
  background-color: rgba(255, 255, 255, 0.8);
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
}

.search-input:not(:focus) {
  color: #808080;
}

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
  font-family: 'Roboto', sans-serif;;
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