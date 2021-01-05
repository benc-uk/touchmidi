/*
  TouchMIDI v2
  config.js - Config dialog shown at startup
  Ben Coleman, Dec 2020 
*/

import { html, define, dispatch } from 'hybrids'
import * as midi from '../midi.js'
import { removeStorage } from '../utils.js'
import css from './config.css'

import pkg from '../../package.json'

export let defaultConfig = {
  deviceId: 'output-1',
  globalChannel: 1,
  restoreValues: false
}

function startClicked(host) {
  // Get config values from HTML
  const deviceId = host.shadowRoot.querySelector('#deviceList').value
  const globalChannel = parseInt(host.shadowRoot.querySelector('#channel').value) || 0
  const restoreValues = host.shadowRoot.querySelector('#restoreValues').checked
  const fullScreen = host.shadowRoot.querySelector('#fullScreen').checked

  // Safe guard
  if (!deviceId) {
    return
  }

  // Wipe values when disabled, this allows user to reset any stored values
  if (!restoreValues) {
    removeStorage()
  }

  // Save new config options back to local storage (after wipe)
  const filename = window.location.pathname.substring(window.location.pathname.lastIndexOf('/') + 1)
  localStorage.setItem(`touchmidi.${filename}.config`, JSON.stringify({ deviceId, globalChannel, restoreValues }))

  // Notify listeners (main.js) we're done
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

function deviceSelected(host) {
  host.shadowRoot.querySelector('#start').classList.remove('disabled')
}

const Component = {
  //channelNames: [],

  render: () => {
    // Modal darken background & block layout behind it
    document.getElementById('pageMask').style.display = 'block'

    if (!midi.access) {
      alert('No MIDI access, something went wrong!\nYou should never see this error!')
      return
    }

    // Hang on! There's no devices!!
    if (midi.access.outputs.size == 0) {
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
      config = defaultConfig
    }

    // We can't use any JS in the rendered HTML
    // This is a workaround to pre-detect if device id will be selected
    let startClass = 'disabled'
    midi.access.outputs.forEach(function (output, id) {
      if (id == config.deviceId) startClass = 'enabled'
    })

    return html`
      <div id="dialog">
        <span id="title">Touch Midi v${pkg.version} &nbsp; <a href="https://code.benco.io/touchmidi/" target="_blank">[[ GitHub ]]</a></span>
        <div id="container">
          <div class="box">
            Select MIDI Device
            <select size="5" id="deviceList" onchange="${deviceSelected}">
              ${Array.from(midi.access.outputs.entries()).map(
                (device) => html`<option value="${device[0]}" selected="${device[0] == config.deviceId}">${device[1].name}</option>`
              )}
            </select>
            <br />
          </div>
          <div class="box">
            MIDI Channels
            <select id="channel">
              <option value="0">Set By Layout</option>
              ${channels.map((chan) => html`<option value="${chan + 1}" selected="${chan == config.globalChannel - 1}">${chan + 1}</option>`)}
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
        <button onclick="${startClicked}" id="start" class="${startClass}">Start</button>
      </div>
    `.style(css)
  }
}

define('midi-config', Component)
