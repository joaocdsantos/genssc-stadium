<template>
  <div class="main-container">

    <div v-if="!isLandscape && (isMobile || isTablet)" class="orientation-overlay">
      <!-- Message to turn mobile to landscape-->
      <PortraitMessage/>
    </div>

    <div v-else>
      <!-- 3D Scene -->
      <ThreeCanvas ref="threeRef"
                   :occupants="occupants"
                   @seatClick="onSeatClick"/>

      <!-- Search -->
      <SearchSelect v-model="searchName"
                    :uniqueNames="uniqueNames"/>

      <!-- Modal -->
      <InfoModal :visible="modalVisible"
                 :chair="selectedChair"
                 @close="modalVisible=false"/>

      <!-- Footer -->
      <Footer/>
    </div>

  </div>
</template>

<script setup>
import {ref, computed, watch} from 'vue'
import ThreeCanvas from '../components/ThreeCanvas.vue'
import SearchSelect from '../components/SearchSelect.vue'
import InfoModal from '../components/InfoModal.vue'
import occupants from '../assets/data.json'
import Footer from "../components/Footer.vue";
import {DeviceService} from '../services/DeviceService.js';
import PortraitMessage from "../components/PortraitMessage.vue";


const threeRef = ref(null)
const searchName = ref('')
const modalVisible = ref(false)
const selectedChair = ref({})
const {isMobile, isTablet, isPortrait, isLandscape} = DeviceService()


const uniqueNames = computed(() => [...new Set(
    occupants.map(o => o.nome).filter(n => n && n.trim())
)].sort())

watch(searchName, v => {
  if (v) threeRef.value?.highlightByName(v)
  else threeRef.value?.clearHighlight()
})

function onSeatClick(info) {
  selectedChair.value = info
  modalVisible.value = true
}
</script>


<style scoped>
.main-container {
  position: relative;
  width: 100%;
  /* viewport units for mobile */
  height: 100dvh;
  min-height: 100svh;
  --footer-h: 64px;
  padding-bottom: var(--footer-h);
}
</style>
