<script setup lang="ts">
import { WebMidi, type NoteMessageEvent, Input } from 'webmidi'
import { reactive, ref, watch } from 'vue'
import * as Tone from 'tone'

const currentNotes = reactive<any[]>([])
const availableDevices = reactive<any[]>([])
const selectedDevice = ref<number | null>(null)

const knobRotation1 = ref(0)
const knobRotation2 = ref(0)
const knobRotation3 = ref(0)
const knobRotation4 = ref(0)
let samplerIsReady = false

const sampler = new Tone.Sampler({
  urls: {
    C3: '_C4.L.mp3',
    'D#3': '_Ds4.L.mp3',
    'F#3': '_Fs4.L.mp3',
    A3: '_A4.L.mp3'
  },

  release: 1,
  baseUrl: ''
}).toDestination()

Tone.loaded().then(() => {
  samplerIsReady = true
  console.log('Sampler is ready')
})

WebMidi.enable()
  .then(onEnabled)
  .catch((err) => alert(err))

availableDevices.push({ name: 'Select a device...', index: null })
const isDragging = ref(false)
const isDraggingKnob1 = ref(false)
const isDraggingKnob2 = ref(false)
const isDraggingKnob3 = ref(false)
const isDraggingKnob4 = ref(false)

function onEnabled() {
  // Viewing available inputs and outputs
  console.log(WebMidi.inputs)
  console.log(WebMidi.outputs)
  // Inputs
  WebMidi.inputs.forEach((input, index) => {
    availableDevices.push({ name: input.name, index })
  })

  // Retrieve an input by name, id or index
  // var input = WebMidi.getInputByName("My Awesome Keyboard");
  // input = WebMidi.getInputById("1809568182");

  if (WebMidi.inputs.length == 0) {
    alert('No hay ningun dispotivo MIDI conectado')
  }
  let input: Input

  watch(selectedDevice, () => {
    if (selectedDevice.value) {
      if (input) {
        input.removeListener()
      }
      input = WebMidi.inputs[selectedDevice.value]
      if (input) {
        // Listen for a 'note on' message on all channels
        input.addListener('noteon', function (e: NoteMessageEvent) {
          console.log(e)
          let currentNote = e.note.name + (e.note.accidental ?? '') + e.note.octave
          // note.value = currentNote
          if (!currentNotes.includes(currentNote)) {
            currentNotes.push(currentNote)
          }
          if (samplerIsReady) sampler.triggerAttackRelease([currentNote], 4)
          // const audio = new Audio(`_${currentNote}.mp3`)
          // audio.play()
          // console.log("Received 'noteon' message (" + currentNote + ').')
        })
        // Listen for a 'note on' message on all channels
        input.addListener('noteoff', function (e: NoteMessageEvent) {
          let currentNote = e.note.name + (e.note.accidental ?? '') + e.note.octave

          const index = currentNotes.indexOf(currentNote)
          if (index > -1) {
            currentNotes.splice(index, 1)
          }
          // console.log(e)
          // console.log(
          //   "Received 'noteoff' message (" +
          //     e.note.name +
          //     (e.note.accidental ?? '') +
          //     e.note.octave +
          //     ').'
          // )
        })
      }
    } else {
      input.removeListener()
      input = null
    }
  })

  // Listen to pitch bend message on channel 3
  // input.addListener('pitchbend', 1, function (e) {
  //   console.log("Received 'pitchbend' message.", e)
  // })

  // Listen to control change message on all channels
  // input.addListener('controlchange', 'all', function (e) {
  //   console.log("Received 'controlchange' message.", e)
  // })

  // Remove all listeners for 'noteoff' on all channels
  // input.removeListener('noteoff')

  // Remove all listeners on the input
  // input.removeListener()
}

const prevMouseAngle = ref(0)

const startDrag = (event: any) => {
  isDragging.value = true
  // prevMouseAngle.value = getMouseAngle(event)
}

const endDrag = () => {
  isDragging.value = false
  isDraggingKnob1.value = false
  isDraggingKnob2.value = false
  isDraggingKnob3.value = false
  isDraggingKnob4.value = false
}

const drag = (event: any, knobRotation: any, isDragging: any) => {
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
  const knob = document.querySelector('.knob')
  if (knob) {
    const knobRect = knob?.getBoundingClientRect()
    const knobCenterX = knobRect.left + knobRect.width / 2
    const knobCenterY = knobRect.top + knobRect.height / 2
    const mouseAngle =
      Math.atan2(event.clientY - knobCenterY, event.clientX - knobCenterX) * (180 / Math.PI)
    return mouseAngle < 0 ? mouseAngle + 360 : mouseAngle
  }
  return 0
}

const knob = document.querySelector('.knob')
knob?.addEventListener('mousedown', startDrag)
window.addEventListener('mouseup', endDrag)
// window.addEventListener('mousemove', drag)
window.addEventListener('mousemove', (event) => {
  if (isDraggingKnob1.value) drag(event, knobRotation1, isDraggingKnob1)
  if (isDraggingKnob2.value) drag(event, knobRotation2, isDraggingKnob2)
  if (isDraggingKnob3.value) drag(event, knobRotation3, isDraggingKnob3)
  if (isDraggingKnob4.value) drag(event, knobRotation4, isDraggingKnob4)
})
</script>

<template>
  <div class="ui">
    <div class="marimba" style="color: red"></div>
    <div class="compressor">
      <div class="knob attack">
        <div
          class="knob-handle"
          :style="{ transform: 'rotate(' + knobRotation1 + 'deg)' }"
          @mousedown="
            (e) => {
              isDraggingKnob1 = true
              startDrag(e)
            }
          "
        ></div>
      </div>
      <div
        class="knob release"
        @mousedown="
          (e) => {
            isDraggingKnob2 = true
            startDrag(e)
          }
        "
      >
        <div class="knob-handle" :style="{ transform: 'rotate(' + knobRotation2 + 'deg)' }"></div>
      </div>
      <div
        class="knob threshold"
        @mousedown="
          (e) => {
            isDraggingKnob3 = true
            startDrag(e)
          }
        "
      >
        <div class="knob-handle" :style="{ transform: 'rotate(' + knobRotation3 + 'deg)' }"></div>
      </div>
      <div
        class="knob ratio"
        @mousedown="
          (e) => {
            isDraggingKnob4 = true
            startDrag(e)
          }
        "
      >
        <div class="knob-handle" :style="{ transform: 'rotate(' + knobRotation4 + 'deg)' }"></div>
      </div>
    </div>
    <div class="device">
      <label for="device">Device: </label>
      <select class="form-control" id="device" v-model="selectedDevice">
        <option :key="device.index" v-for="device in availableDevices" :value="device.index">
          {{ device.name }}
        </option>
      </select>
      <span style="color: rebeccapurple">{{ currentNotes }}</span>
    </div>
    <div class="patterns">
      <input type="number" name="bpm" id="bpmInput" value="100" />
    </div>
  </div>
</template>

<style>
.knob {
  width: 70px;
  height: 70px;
  top: 42px;
  left: 28px;
  /* background-color: #e0e0e0; */
  /* border-radius: 50%; */
  position: relative;
  overflow: hidden;
  /* box-shadow: 0 0 10px rgba(0, 0, 0, 0.3); */
}

.knob-handle {
  width: 70px;
  height: 70px;
  background-image: url(assets/Knob/Group75.png);
  background-size: contain;
  position: absolute;
  /* top: 50%;
  left: 50%; */
  /* transform: translate(-50%, -50%); */
  /* border-radius: 5px; */
}
.release {
  top: 53px;
}
.device {
  position: absolute;
  top: 10px;
  left: 40px;
}
.threshold {
  top: 64px;
}
.ratio {
  top: 75px;
}

.ui {
  background-image: url(assets/Frame.png);
  width: 1145px;
  height: 739px;
  background-size: cover;
  background-repeat: no-repeat;
  position: relative;
}
.patterns {
  background-image: url(assets/Patrones.png);
  width: 449px;
  height: 197px;
  background-size: cover;
  background-repeat: no-repeat;
  position: relative;
  top: 500px;
  left: 30px;
}
.patterns > input {
  position: absolute;
  right: 100px;
  width: 70px;
  font-size: 22px;
  top: 120px;
  text-align: right;
  border: none;
}
.marimba {
  background-image: url(assets/marimba/Frame.png);
  width: 836px;
  height: 327px;
  position: absolute;
  top: 40px;
  left: 80px;
}
.compressor {
  background-image: url(assets/Compresor.png);
  width: 126px;
  height: 386px;
  position: absolute;
  right: 40px;
  top: 40px;
}
label {
  color: #010101;
}
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
