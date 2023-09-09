<template>
  <div class="marimba">
    <div
      v-if="currentNote1"
      class="layer"
      :style="{ backgroundImage: `url('Marimba/${currentNote1}.png')` }"
    ></div>
    <div
      v-if="currentNote2"
      class="layer"
      :style="{ backgroundImage: `url('Marimba/${currentNote2}.png')` }"
    ></div>
    <div
      v-if="currentNote3"
      class="layer"
      :style="{ backgroundImage: `url('Marimba/${currentNote3}.png')` }"
    ></div>
    <div
      v-if="currentNote4"
      class="layer"
      :style="{ backgroundImage: `url('Marimba/${currentNote4}.png')` }"
    ></div>
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

// const [currentNote1, currentNote2, currentNote3, currentNote4] = computed(() => {
//   return props.currentNotes.length > 0 ? props.currentNotes : [null, null, null, null]
// })
// const { currentNote1, currentNote2, currentNote3, currentNote4 } = { ...props.currentNotes }
</script>
<style scoped>
.marimba {
  background-image: url(Marimba/Frame.png);
  width: 851px;
  height: 309px;
  position: absolute;
  background-size: contain;
  top: 140px;
  left: 80px;
}
.layer {
  width: 951px;
  height: 349px;
  position: absolute;
  top: 0px;
  left: 0px;
}
</style>
