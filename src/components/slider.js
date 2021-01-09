/*
  TouchMIDI v2
  slider.js - A widget that acts like a slider or fader, sends MIDI CC or NRPN messages
  Ben Coleman, Dec 2020 
*/

import { html, define, property } from 'hybrids'
import * as midi from '../midi.js'
import { darkenColour, formatLabel, saveWidgetValue } from '../utils.js'
import css from './slider.css'

// =====================================================================================
// Used as the observer function for widgets _update property used by sliders and encoders
// =====================================================================================
export function updateObserver(host, update) {
  if (update.restoreValue) {
    host.value = update.restoreValue
    return
  }

  // IMPORTANT: save x & y as previousPos
  host._previousPos = { x: update.x, y: update.y }

  // Work out new value based on dx or dy
  var tempValue = 0
  if (host.horizontal) tempValue = host.value + update.dx
  else tempValue = host.value - update.dy

  // Clamp to min and max
  if (tempValue > host.max) tempValue = host.max
  if (tempValue < host.min) tempValue = host.min

  // Finally update the value (which will trigger a render)
  host.value = Math.round(tempValue)
}

export const Component = {
  // Private internal properties
  _previousPos: null,
  _width: 30,
  _update: {
    observe: updateObserver
  },

  // MIDI properties
  value: Number.MIN_SAFE_INTEGER,
  chan: 1,
  cc: -1,
  nrpn: '',
  min: 0,
  max: 127,
  pitchBend: false,

  // Display & UX properties
  colour: property('#ffffff'),
  label: '__unset__',
  horizontal: false,
  labelScale: 1,
  grow: 1,

  render: ({ value, colour, label, min, max, cc, chan, horizontal, nrpn, pitchBend, _width, labelScale, grow }) => {
    // Safeguard against sending MIDI messages on first start
    const originalValue = value

    saveWidgetValue('midi-slider', `${cc}${chan}${nrpn}`, value)

    // Clamp to min and max
    if (value > max) value = max
    if (value < min) value = min

    const percent = Math.round(((value - min) / (max - min)) * 100.0)
    const direction = horizontal ? 'right' : 'top'

    // Default label is to show the value
    if (label === '__unset__') {
      label = '%v'
    }

    // We use some CSS tricks to draw the value as a percentage
    const newStyle = `
    :host { 
      flex-grow: ${grow} 
    }
    div {
      background: linear-gradient(to ${direction}, ${darkenColour(colour)} ${percent}%, var(--bg) ${percent}%);
      color: ${colour};
      border-color: ${colour};
      font-size: ${_width * 0.2 * labelScale}px;
    }`

    // Handle MIDI actions, might be CC or NRPN
    if (cc > 0 && originalValue > Number.MIN_SAFE_INTEGER) {
      midi.sendCC(cc, chan, value)
    }
    if (nrpn && originalValue > Number.MIN_SAFE_INTEGER) {
      midi.sendNRPN(nrpn, chan, value, max > 127)
    }
    // Pitch bend support, not sure how useful
    if (pitchBend) {
      midi.sendPitchBend(chan, value)
    }

    return html`<div innerHTML="${formatLabel(label, value, percent, chan, cc)}"></div>`.style(css, newStyle)
  }
}

define('midi-slider', Component)
