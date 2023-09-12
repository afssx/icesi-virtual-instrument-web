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
</script>
<style scoped>
.display {
  width: 220px;
  height: 40px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  position: absolute;
  right: 49px;
  top: 62px;
  gap: 18px;
}
.note {
  flex: 1 1 0px;
  text-align: center;
  padding-top: 6px;
  font-size: 18px;
  color: gray;
}
</style>
