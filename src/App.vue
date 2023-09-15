<script setup lang="ts">
import { WebMidi, type NoteMessageEvent, Input } from 'webmidi'
import { reactive, ref, watch } from 'vue'
import * as Tone from 'tone'
import Marimba from './components/MarimbaComponent.vue'
import Knob from './components/KnobComponent.vue'
import Compressor from './components/CompressorComponent.vue'
import NotesDisplay from './components/NotesDisplay.vue'
const currentNotes = reactive<any[]>([])
const lastNote = ref<string>('')
const availableDevices = reactive<any[]>([])
const selectedDevice = ref<number | null>(null)

let samplerIsReady = false

const samplerForte = new Tone.Sampler({
  urls: {
    C3: 'Forte/C3f.mp3',
    'D#3': 'Forte/Ds3f.mp3',
    'F#3': 'Forte/Fs3f.mp3',
    A3: 'Forte/A3f.mp3',
    C4: 'Forte/C4f.mp3',
    'D#4': 'Forte/Ds4f.mp3',
    'F#4': 'Forte/Fs4f.mp3',
    A4: 'Forte/A4f.mp3'
  },
  release: 1,
  baseUrl: ''
}).toDestination()

const samplerPiano = new Tone.Sampler({
  urls: {
    C3: 'Piano/C3p.mp3',
    'D#3': 'Piano/Ds3p.mp3',
    'F#3': 'Piano/Fs3p.mp3',
    A3: 'Piano/A3p.mp3',
    C4: 'Piano/C4p.mp3',
    'D#4': 'Piano/Ds4p.mp3',
    'F#4': 'Piano/Fs4p.mp3',
    A4: 'Piano/A4p.mp3'
  },
  release: 1,
  baseUrl: ''
}).toDestination()

const samplerMezzoPiano = new Tone.Sampler({
  urls: {
    C3: 'Mezzopiano/C3mp.mp3',
    'D#3': 'Mezzopiano/Ds3mp.mp3',
    'F#3': 'Mezzopiano/Fs3mp.mp3',
    A3: 'Mezzopiano/A3mp.mp3',
    C4: 'Mezzopiano/C4mp.mp3',
    'D#4': 'Mezzopiano/Ds4mp.mp3',
    'F#4': 'Mezzopiano/Fs4mp.mp3',
    A4: 'Mezzopiano/A4mp.mp3'
  },
  release: 1,
  baseUrl: ''
}).toDestination()

const samplerMezzoForte = new Tone.Sampler({
  urls: {
    C3: 'Mezzoforte/C3mf.mp3',
    'D#3': 'Mezzoforte/Ds3mf.mp3',
    'F#3': 'Mezzoforte/Fs3mf.mp3',
    A3: 'Mezzoforte/A3mf.mp3',
    C4: 'Mezzoforte/C4mf.mp3',
    'D#4': 'Mezzoforte/Ds4mf.mp3',
    'F#4': 'Mezzoforte/Fs4mf.mp3',
    A4: 'Mezzoforte/A4mf.mp3'
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
let input: Input

const reverb = new Tone.Freeverb({
  roomSize: 0.8, // Ajusta el tamaño de la habitación (room size) aquí
  dampening: 3000, // Ajusta el parámetro de dampening si es necesario
  wet: 0.5
}).toDestination()

function onEnabled() {
  // Viewing available inputs and outputs
  console.log(WebMidi.inputs)
  console.log(WebMidi.outputs)
  // Inputs
  WebMidi.inputs.forEach((input, index) => {
    availableDevices.push({ name: input.name, index })
  })
  if (WebMidi.inputs.length == 0) {
    alert('No hay ningun dispotivo MIDI conectado')
  }
}

watch(selectedDevice, () => {
  if (selectedDevice.value) {
    if (input) {
      input.removeListener()
    }
    input = WebMidi.inputs[selectedDevice.value]
    if (input) {
      let sampler: Tone.Sampler
      sampler = samplerMezzoForte
      // sampler.chain(reverb, Tone.Destination)
      // Listen for a 'note on' message on all channels
      input.addListener('noteon', function (e: NoteMessageEvent) {
        let currentNote = e.note.name + (e.note.accidental ?? '') + e.note.octave
        lastNote.value = currentNote
        if (!currentNotes.includes(currentNote) && currentNotes.length < 4) {
          if (samplerIsReady) sampler.triggerAttackRelease([currentNote], 4)
          currentNotes.push(currentNote)
        }
        console.log("Received 'noteon' message (" + currentNote + ').')
      })
      // Listen for a 'note on' message on all channels
      input.addListener('noteoff', function (e: NoteMessageEvent) {
        let currentNote = e.note.name + (e.note.accidental ?? '') + e.note.octave
        lastNote.value = ''
        const index = currentNotes.indexOf(currentNote)
        if (index > -1) {
          currentNotes.splice(index, 1)
        }
      })
    }
  } else {
    if (input) {
      input.removeListener()
      input = null
    }
  }
})
</script>

<template>
  <div class="ui">
    <Marimba :current-notes="currentNotes" />
    <NotesDisplay :current-notes="currentNotes" />
    <Compressor class="compressor" />
    <div class="device">
      <select class="form-control" id="device" v-model="selectedDevice">
        <option :key="device.index" v-for="device in availableDevices" :value="device.index">
          {{ device.name }}
        </option>
      </select>
    </div>
    <div class="patterns">
      <input type="number" name="bpm" id="bpmInput" value="100" />
    </div>
    <div class="reverb">
      <Knob name="Attack" class="k2" />
      <Knob name="Attack" class="k3" />
    </div>
  </div>
</template>

<style>
.release {
  top: 53px;
}
.device {
  position: absolute;
  top: 54px;
  left: 160px;
}
.threshold {
  top: 64px;
}
.ratio {
  top: 75px;
}
.reverb {
  background-image: url(/images/Reverb.png);
  width: 500px;
  height: 250px;
  position: absolute;
  bottom: 10px;
  right: 140px;
  background-size: contain;
  background-repeat: no-repeat;
}
.ui {
  background-image: url(/images/NewFrame.png);
  width: 1145px;
  height: 835px;
  background-size: cover;
  background-repeat: no-repeat;
  position: relative;
}
.patterns {
  background-image: url(/images/Patrones.png);
  width: 449px;
  height: 197px;
  background-size: cover;
  background-repeat: no-repeat;
  position: relative;
  top: 610px;
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

.compressor {
  position: absolute;
  right: 40px;
  top: 180px;
}
label {
  color: #010101;
}
header {
  line-height: 1.5;
  max-height: 100vh;
}

@media (min-width: 1024px) {
}
.k2 {
  top: 40px;
  left: 2px;
  width: 110px !important;
  height: 110px !important;
}
.k2 > div {
  width: 110px !important;
  height: 110px !important;
}
.k3 {
  top: 50px;
  left: 23px;
  width: 68px !important;
  height: 68px !important;
}
.k3 > div {
  width: 68px !important;
  height: 68px !important;
}
</style>
