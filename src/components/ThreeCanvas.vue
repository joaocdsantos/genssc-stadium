<template>
  <div class="three-container" ref="container"></div>
</template>

<script setup>
import {onMounted, onBeforeUnmount, ref, shallowRef, defineExpose} from 'vue'
import {ThreeService} from '../services/ThreeService'

const props = defineProps({
  occupants: {type: Array, default: () => []},
})
const emit = defineEmits(['seatClick'])

const container = ref(null)
const three = shallowRef(null)

onMounted(() => {
  three.value = new ThreeService(
      container.value,
      props.occupants,
      (seatInfo) => emit('seatClick', seatInfo),
  )
  three.value.init()
})

onBeforeUnmount(() => {
  three.value?.dispose()
  three.value = null
})

function highlightByName(name) {
  three.value?.highlightByName(name)
}

function clearHighlight() {
  three.value?.clearHighlight?.()
}

defineExpose({highlightByName, clearHighlight})
</script>

<style scoped>
.three-container {
  position: absolute;
  inset: 0;
}
</style>