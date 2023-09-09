<template>
  <div class="display">
    <div class="note">{{ currentNote1 }}</div>
    <div class="note">{{ currentNote2 }}</div>
    <div class="note">{{ currentNote3 }}</div>
    <div class="note">{{ currentNote4 }}</div>
  </div>
</template>
<script lang="ts" setup>
import { computed } from 'vue'

const props = defineProps<{
  currentNotes: string[]
}>()
const currentNote4 = computed(() => {
  return props.currentNotes[3] ? props.currentNotes[3] : null
})
const currentNote3 = computed(() => {
  return props.currentNotes[2] ? props.currentNotes[2] : null
})
const currentNote2 = computed(() => {
  return props.currentNotes[1] ? props.currentNotes[1] : null
})

const currentNote1 = computed(() => {
  return props.currentNotes[0] ? props.currentNotes[0] : null
})

// const [currentNote1, currentNote2, currentNote3, currentNote4] = computed(() => {
//   return props.currentNotes.length > 0 ? props.currentNotes : [null, null, null, null]
// })
// const { currentNote1, currentNote2, currentNote3, currentNote4 } = { ...props.currentNotes }
</script>
<style scoped>
.display {
  width: 210px;
  height: 100px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  position: absolute;
  right: 56px;
  top: 66px;
  font-size: 20px;
  color: gray;
}
</style>
