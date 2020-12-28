import { html, define, property } from 'hybrids'
import * as midi from '../midi.js'
import { darkenColour, formatLabel, updateObserver, saveWidgetValue } from '../utils.js'
import css from './slider.css'

export const Component = {
  // Private internal properties
  _previousPos: null,
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

  // Display & UX properties
  colour: property('#ffffff'),
  label: '__unset__',
  horizontal: false,

  render: ({ value, colour, label, min, max, cc, chan, horizontal, nrpn }) => {
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
    const newStyle = `div {
      background: linear-gradient(to ${direction}, ${darkenColour(colour)} ${percent}%, var(--bg) ${percent}%);
      color: ${colour};
      border-color: ${colour};
    }`

    // Handle MIDI actions, might be CC or NRPN
    if (cc > 0) {
      midi.sendCC(cc, chan, value)
    }
    if (nrpn) {
      midi.sendNRPN(nrpn, chan, value, max > 127)
    }

    return html`<div innerHTML="${formatLabel(label, value, percent, chan, cc)}"></div>`.style(css, newStyle)
  }
}

define('midi-slider', Component)
