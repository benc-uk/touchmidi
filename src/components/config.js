/*
  TouchMIDI v2
  config.js - Config dialog shown at startup
  Ben Coleman, Dec 2020 
*/

import { html, define, dispatch } from 'hybrids'
import css from './config.css'

function startClicked(host) {
  // Get config values from HTML
  const deviceId = host.shadowRoot.querySelector('#deviceList').value
  const globalChannel = parseInt(host.shadowRoot.querySelector('#channel').value) || 0
  const restoreValues = host.shadowRoot.querySelector('#restoreValues').checked
  const fullScreen = host.shadowRoot.querySelector('#fullScreen').checked

  if (!deviceId) {
    return
  }

  if (!restoreValues) {
    localStorage.clear()
  }

  // Save config options to local storage
  const filename = window.location.pathname.substring(window.location.pathname.lastIndexOf('/') + 1)
  localStorage.setItem(`touchmidi.${filename}.config`, JSON.stringify({ deviceId, globalChannel, restoreValues }))

  // Notify we're done
  dispatch(host, 'config-done', {
    detail: {
      deviceId,
      globalChannel,
      restoreValues
    }
  })

  if (fullScreen) {
    document.body.requestFullscreen()
  }

  // Remove dialog and page mask
  document.getElementById('pageMask').style.display = 'none'
  document.body.removeChild(host)
}

const Component = {
  midiAccess: {},
  render: ({ midiAccess }) => {
    // Modal darken background
    document.getElementById('pageMask').style.display = 'block'

    if (!midiAccess) {
      alert('No MIDI access, something went wrong!\nYou should never see this error!')
      return
    }

    // Hang on! There's no devices!!
    if (midiAccess.outputs.size == 0) {
      //alert('No MIDI output devices found!\nConnect a MIDI device and reload the page')
      return html` <div id="dialog">
        <div class="box" style="text-align:center">
          No MIDI output devices were found &#128549;<br /><br />Please attach a MIDI device and try again
        </div>
        <button onclick="window.location.reload()" id="start" class="enabled" style="background-color:darkgreen">Reload</button>
      </div>`.style(css)
    }

    // Simple array of ints 0 -15 for each MIDI channel number
    const channels = Array.from(Array(16).keys())

    // Restore saved options
    const filename = window.location.pathname.substring(window.location.pathname.lastIndexOf('/') + 1)
    const configJSON = localStorage.getItem(`touchmidi.${filename}.config`)
    let config = {}
    if (configJSON) {
      config = JSON.parse(configJSON)
    } else {
      config = {
        deviceId: 'output-1',
        globalChannel: 1,
        restoreValues: true
      }
    }

    return html`
      <div id="dialog">
        <div id="container">
          <div class="box">
            Select MIDI Device
            <select size="5" id="deviceList">
              ${Array.from(midiAccess.outputs.entries()).map(
                (device) => html`<option value="${device[0]}" selected="${device[0] == config.deviceId}">${device[1].name}</option>`
              )}
            </select>
            <br />
          </div>
          <div class="box">
            MIDI Channel
            <select id="channel">
              ${channels.map((chan) => html`<option value="${chan + 1}" selected="${chan == config.globalChannel - 1}">${chan + 1}</option>`)}
              <option value="0">Set By Layout</option>
            </select>
          </div>
          <div class="box">
            <input type="checkbox" id="restoreValues" name="restoreValues" checked="${config.restoreValues}" />
            <label for="restoreValues">Save &amp; Restore at Startup</label>
            <br />
            <input type="checkbox" id="fullScreen" name="fullScreen" />
            <label for="fullScreen">Start Fullscreen</label>
          </div>
        </div>
        <button onclick="${startClicked}" id="start">Start</button>
      </div>
    `.style(css)
  }
}

define('midi-config', Component)
