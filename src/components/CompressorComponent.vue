<template>
  <div class="compressor-container">
    <Knob name="Attack" />
    <Knob name="Release" />
    <Knob name="Threshold" />
    <Knob name="Ratio" />
  </div>
</template>
<script lang="ts" setup>
import Knob from './KnobComponent.vue'
</script>
<style scoped>
.compressor-container {
  background-image: url(./images/Compresor.png);
  width: 126px;
  height: 386px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-top: 10px;
  gap: 11px;
  align-items: center;
}
</style>
