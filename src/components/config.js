import { html, define, dispatch } from 'hybrids'
import * as midi from '../midi.js'
import css from './config.css'

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
