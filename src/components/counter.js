/*
  TouchMIDI v2
  counter.js - A pair of buttons that increments and decrements a MIDI CC value
  Ben Coleman, Dec 2020 
*/

import { html, define, property } from 'hybrids'
import * as midi from '../midi.js'
import { darkenColour, formatLabel, saveWidgetValue } from '../utils.js'
import css from './counter.css'

function eventPressed(host, evt) {
  evt.preventDefault()

  if (evt.target.id == 'inc') {
    host.value = host.value + 1
  } else {
    host.value = host.value - 1
  }

  // Clamp to min and max
  if (host.value > host.max) host.value = host.max
  if (host.value < host.min) host.value = host.min

  // Handle MIDI actions, only CC for now
  if (host.cc > 0) {
    midi.sendCC(host.cc, host.chan, host.value)
  }
}

export const Component = {
  // Private internal properties
  _width: 30,

  // MIDI properties
  chan: 1,
  cc: -1,
  value: 0,
  min: 0,
  max: 127,

  // Display & UX properties
  colour: property('#ffffff'),
  label: '__unset__',
  labelScale: 1,
  grow: 1,

  render: ({ label, colour, chan, cc, _width, labelScale, grow, value }) => {
    saveWidgetValue('midi-counter', `${cc}${chan}0`, value)

    const newStyle = `
    :host {
      flex-grow: ${grow}
    }
    button:active {
      background-color: ${darkenColour(colour)};
    }
    #label {
      font-size: ${_width * 0.2 * labelScale}px !important;
      border-color: ${colour};
      color: ${colour};
      background-color: var(--bg);
    }
    button {
      color: ${colour};
      border-color: ${colour};
      font-size: ${_width * 0.3 * labelScale}px !important;
    }`

    return html`<div>
      <span id="label" innerHTML="${value}"></span>
      <button id="dec" onmousedown="${eventPressed}" ontouchstart="${eventPressed}">-1</button>
      <button id="inc" onmousedown="${eventPressed}" ontouchstart="${eventPressed}">+1</button>
    </div>`.style(css, newStyle)
  }
}

define('midi-counter', Component)
