<template>
  <div class="marimba">
    <transition name="fade" mode="out-in">
      <div
        v-if="currentNote1"
        class="layer"
        :style="{ backgroundImage: `url('./images/Marimba/${currentNote1}.png')` }"
      ></div>
    </transition>
    <transition name="fade" mode="out-in">
      <div
        v-if="currentNote2"
        class="layer"
        :style="{ backgroundImage: `url('./images/Marimba/${currentNote2}.png')` }"
      ></div>
    </transition>
    <transition name="fade" mode="out-in">
      <div
        v-if="currentNote3"
        class="layer"
        :style="{ backgroundImage: `url('./images/Marimba/${currentNote3}.png')` }"
      ></div>
    </transition>
    <transition name="fade" mode="out-in">
      <div
        v-if="currentNote4"
        class="layer"
        :style="{ backgroundImage: `url('./images/Marimba/${currentNote4}.png')` }"
      ></div>
    </transition>
  </div>
</template>
<script lang="ts" setup>
import { computed } from 'vue'

const props = defineProps<{
  currentNotes: string[]
}>()
const currentNote4 = computed(() => {
  return props.currentNotes[3] ? props.currentNotes[3].replace('#', 'S') : null
})
const currentNote3 = computed(() => {
  return props.currentNotes[2] ? props.currentNotes[2].replace('#', 'S') : null
})
const currentNote2 = computed(() => {
  return props.currentNotes[1] ? props.currentNotes[1].replace('#', 'S') : null
})

const currentNote1 = computed(() => {
  return props.currentNotes[0] ? props.currentNotes[0].replace('#', 'S') : null
})
</script>
<style scoped>
.marimba {
  background-image: url(./images/Marimba/Frame.png);
  width: 851px;
  height: 309px;
  position: absolute;
  background-size: contain;
  top: 140px;
  left: 80px;
}
.layer {
  width: 851px;
  height: 309px;
  position: absolute;
  background-size: contain;
  top: 0px;
  left: 0px;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s; /* Ajusta la duración de la transición según tus preferencias */
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
