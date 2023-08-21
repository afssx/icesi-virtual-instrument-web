<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
import { WebMidi } from 'webmidi'
import { reactive, ref } from 'vue'

const note = ref('')

const currentNotes = reactive([])

if (navigator.requestMIDIAccess) {
  console.log('This browser supports WebMIDI!')
} else {
  console.log('WebMIDI is not supported in this browser.')
}

WebMidi.enable()
  .then(onEnabled)
  .catch((err) => alert(err))

console.log('Enable')

function onEnabled() {
  // Viewing available inputs and outputs
  console.log(WebMidi.inputs)
  console.log(WebMidi.outputs)
  // Inputs
  WebMidi.inputs.forEach((input) => console.log(input.manufacturer, input.name))

  // Outputs
  WebMidi.outputs.forEach((output) => console.log(output.manufacturer, output.name))
  // Retrieve an input by name, id or index
  // var input = WebMidi.getInputByName("My Awesome Keyboard");

  // input = WebMidi.getInputById("1809568182");
  var input = WebMidi.inputs[0]

  // Listen for a 'note on' message on all channels
  input.addListener('noteon', 'all', function (e) {
    console.log(e)
    let currentNote = e.note.name + (e.note.accidental ?? '') + e.note.octave
    // note.value = currentNote
    if (!currentNotes.includes(currentNote)) {
      currentNotes.push(currentNote)
    }
    currentNotes.sort()

    // console.log("Received 'noteon' message (" + currentNote + ').')
  })

  // Listen for a 'note on' message on all channels
  input.addListener('noteoff', 'all', function (e) {
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

  // Listen to pitch bend message on channel 3
  input.addListener('pitchbend', 1, function (e) {
    console.log("Received 'pitchbend' message.", e)
  })

  // Listen to control change message on all channels
  input.addListener('controlchange', 'all', function (e) {
    console.log("Received 'controlchange' message.", e)
  })

  // Remove all listeners for 'noteoff' on all channels
  // input.removeListener('noteoff')

  // Remove all listeners on the input
  // input.removeListener()
}
</script>

<template>
  <div class="ui">
    <h2 style="color: rebeccapurple">{{ note }}</h2>
    <h2 style="color: rebeccapurple">{{ currentNotes }}</h2>
  </div>
  <!-- <header>
    <img class="logo" src="@/assets/UI.jpeg" width="125" height="125" />

    <div class="wrapper">
      <HelloWorld msg="You did it!" />

      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </div>
  </header> -->

  <!-- <RouterView /> -->
</template>

<style scoped>
.ui {
  background-image: url(assets/UI.jpeg);
  width: 1024px;
  height: 768px;
  background-size: cover;
  background-repeat: no-repeat;
  border: solid;
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
