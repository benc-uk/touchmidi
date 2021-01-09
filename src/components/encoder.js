/*
  TouchMIDI v2
  encoder.js - A widget that acts like an encoder or knob, sends MIDI CC or NRPN messages
  Ben Coleman, Dec 2020 
*/

import { html, define, property } from 'hybrids'
import * as midi from '../midi.js'
import { formatLabel, saveWidgetValue } from '../utils.js'
import { updateObserver } from './slider.js'
import css from './encoder.css'

export const Component = {
  // Private internal properties
  _previousPos: null,
  _width: 30,
  _update: {
    // We re-use the same update logic as sliders
    observe: updateObserver
  },

  // MIDI properties
  value: Number.MIN_SAFE_INTEGER,
  chan: 1,
  cc: -1,
  nrpn: '',
  min: 0,
  max: 127,

  // Display & UX properties
  colour: property('#ffffff'),
  label: '__unset__',
  horizontal: false,
  labelScale: 1,
  grow: 1,

  render: ({ value, colour, label, min, max, chan, cc, nrpn, _width, labelScale, grow }) => {
    // Safeguard against sending MIDI messages on first start
    const originalValue = value

    // This widget saves state
    saveWidgetValue('midi-encoder', `${cc}${chan}${nrpn}`, value)

    // Clamp value to min and max
    if (value > max) value = max
    if (value < min) value = min

    const percent = Math.round(((value - min) / (max - min)) * 100.0)
    const valLength = ((value - min) / (max - min)) * 75.0

    // Default label is to show the value
    if (label === '__unset__') {
      label = '%v'
    }

    // Handle MIDI actions, might be CC or NRPN
    if (cc > 0 && originalValue > Number.MIN_SAFE_INTEGER) {
      midi.sendCC(cc, chan, value)
    }
    if (nrpn && originalValue > Number.MIN_SAFE_INTEGER) {
      midi.sendNRPN(nrpn, chan, value, max > 127)
    }

    const newStyle = `
    :host {
      flex-grow: ${grow}
    }
    #label {
      color: ${colour}; 
      font-size:${_width * 0.2 * labelScale}px
    }`

    return html`<div>
      <svg viewBox="0 0 36 36">
        <path
          d="M18 2.0
    a 1 1 0 0 1 0 32
    a 1 1 0 0 1 0 -32"
          fill="none"
          stroke="${colour}"
          stroke-opacity="0.3"
          stroke-width="0.1rem"
          stroke-dasharray="75, 100"
          transform="rotate(226 18 18)"
          stroke-linecap="round"
        />
        <path
          d="M18 2.0
    a 1 1 0 0 1 0 32
    a 1 1 0 0 1 0 -32"
          fill="none"
          stroke="${colour}"
          stroke-width="0.25rem"
          stroke-dasharray="${valLength}, 100"
          transform="rotate(226 18 18)"
          stroke-linecap="round"
        />
      </svg>
      <div id="label" innerHTML="${formatLabel(label, value, percent, chan, cc)}"></div>
    </div>`.style(css, newStyle)
  }
}

define('midi-encoder', Component)
