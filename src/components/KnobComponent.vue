<template>
  <div class="knob" ref="knob" :title="props.name">
    <!-- <p v-if="showValue">{{ parseInt(knobRotation.toString()) }}</p> -->
    <div
      class="knob-handle"
      :style="{ transform: 'rotate(' + knobRotation + 'deg)' }"
      @mousedown="
        (e) => {
          isDragging = true
          startDrag(e)
        }
      "
    ></div>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted } from 'vue'

const knobRotation = ref(0)
const isDragging = ref(false)
const prevMouseAngle = ref(0)
const knob = ref(null)
const props = defineProps<{
  name: string
  // showValue: { type: Boolean; default: false }
}>()

onMounted(() => {
  if (knob.value) {
    knob.value.addEventListener('mousedown', startDrag)
    window.addEventListener('mouseup', endDrag)
    window.addEventListener('mousemove', drag)
  }
})

const startDrag = (event: any) => {
  isDragging.value = true
  prevMouseAngle.value = getMouseAngle(event)
}

const endDrag = () => {
  isDragging.value = false
}

const drag = (event: any) => {
  if (isDragging.value) {
    const mouseAngle = getMouseAngle(event)
    const angleDiff = mouseAngle - prevMouseAngle.value
    knobRotation.value += angleDiff
    prevMouseAngle.value = mouseAngle

    if (knobRotation.value >= 360) {
      knobRotation.value -= 360
    } else if (knobRotation.value < 0) {
      knobRotation.value += 360
    }
  }
}

const getMouseAngle = (event: any) => {
  const knobRect = knob?.value.getBoundingClientRect()
  const knobCenterX = knobRect.left + knobRect.width / 2
  const knobCenterY = knobRect.top + knobRect.height / 2
  const mouseAngle =
    Math.atan2(event.clientY - knobCenterY, event.clientX - knobCenterX) * (180 / Math.PI)
  return mouseAngle < 0 ? mouseAngle + 360 : mouseAngle
}
</script>
<style scoped>
.knob {
  width: 70px;
  height: 70px;
  /* top: 42px;
  left: 28px; */
  position: relative;
  overflow: hidden;
  z-index: 10;
}

.knob > p {
  color: grey;
  position: absolute;
  z-index: 11;
  top: 40px;
  left: 18px;
  font-size: 12px;
  user-select: none;
  width: 35px;
  text-align: center;
}

.knob-handle {
  width: 70px;
  height: 70px;
  background-image: url(./images/Group75.png);
  background-size: contain;
  position: absolute;
}
</style>
