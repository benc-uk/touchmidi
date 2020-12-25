import { html, define, dispatch } from 'https://unpkg.com/hybrids@^4/src'
import * as midi from '../midi.js'

function doneClicked(host) {
  // Get the selected device id & channel and notify we're done
  const deviceId = host.shadowRoot.querySelector('select').value
  const globalChannel = parseInt(host.shadowRoot.querySelector('#channelBox .selected').innerText) || 0
  dispatch(host, 'config-done', {
    detail: {
      deviceId,
      globalChannel
    }
  })

  // Remove modal and mask
  document.getElementById('pageMask').style.display = 'none'
  document.body.removeChild(host)
}

function pickDevice(host) {
  host.shadowRoot.querySelector('#start').classList.add('enabled')
  host.shadowRoot.querySelector('#start').disabled = false
}

function channelClicked(host, event) {
  host.shadowRoot.querySelector('#channelBox .selected').classList.replace('selected', 'unselected')
  event.target.classList.replace('unselected', 'selected')
}

const Component = {
  render: () => {
    // Hang on! There's no devices!!
    if (midi.access.outputs.size == 0) {
      alert('No MIDI output devices found! 😢\nConnect a MIDI device and reload the page')
    }

    // Modal darken background
    document.getElementById('pageMask').style.display = 'block'

    // Simple array of ints 0 -15 for each MIDI channel number
    var channels = Array.from(Array(16).keys())
    return html`
      <div id="dialog">
        <div id="container">
          <div class="box">
            Select MIDI Device
            <select id="deviceSelect" size="5" id="deviceList" onchange="${pickDevice}">
              ${Array.from(midi.access.outputs.entries()).map((device) => html`<option value="${device[0]}">${device[1].name}</option>`)}
            </select>
            <br />
          </div>
          <div class="box" id="channelBox">
            Global MIDI Channel<br />
            ${channels.map((chan) => html`<button onclick="${channelClicked}" class="unselected">${chan + 1}</button>`)}<button
              class="selected"
              onclick="${channelClicked}"
            >
              Off
            </button>
          </div>
        </div>
        <button onclick="${doneClicked}" id="start" disabled="true">Done</button>
      </div>
    `.style(css)
  }
}

define('midi-config', Component)

const css = `
#dialog {
  border: var(--b-width) solid;
  border-color: var(--green);
  border-radius: var(--b-radius);
  position: absolute;
  top: 50%;
  left: 50%;
  padding: 1rem;
  transform: translate(-50%, -50%);
  z-index: 100;
  background-color: var(--bg);
  width: 80%
}
#container {
  display: flex;
}
.box {
  flex: 1;
  margin: 0.5rem;
  color: var(--greyl);
  font-size: 2rem;
}
#deviceSelect {
  scrollbar-width: none; 
  background-color: var(--bg);
  color: var(--blue);
  font-size: 1.5rem;
  width: 100%;
  overflow-y: auto;
  border: var(--b-width) solid;
  border-color: var(--greyd);
  border-radius: var(--b-radius);
  height: 80%;
  margin: 0.2rem;
}
button {
  border: var(--b-width) solid;
  border-color: var(--grey);
  border-radius: var(--b-radius);
  background-color: var(--bg);
  font-size: 2rem;
}
#channelBox button {
  width: 4rem;
  margin: 0.2rem;
}
#start {
  margin-top: 1rem;
  width: 100%;
  border-color: var(--greydd);
  color: var(--greydd);
}
.selected {
  color: var(--bg);
  background-color: var(--blue);
  border-color: var(--white);
}
.unselected {
  color: var(--grey);
  background-color: var(--bg);
  border-color: var(--greyd);
}
.enabled {
  color: var(--white) !important;
  border-color: var(--green) !important;
}
`
