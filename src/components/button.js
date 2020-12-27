import { html, define, property } from 'hybrids'
import * as midi from '../midi.js'
import { darkenColour, formatLabel } from '../utils.js'
import css from './button.css'

function eventReleased(host, evt) {
  evt.preventDefault()
  if (!host.toggle) {
    host._pressed = false

    if (host.note) {
      midi.sendNoteOff(host.note, host.chan, host.velo)
    }
  }
}

function eventPressed(host, evt) {
  evt.preventDefault()
  if (host.toggle) {
    host._pressed = !host._pressed
  } else {
    host._pressed = true
  }

  // Handle MIDI actions, might be note, CC or NRPN
  if (host._pressed) {
    if (host.cc > 0) {
      midi.sendCC(host.cc, host.chan, host.value)
    }
    if (host.nrpn) {
      midi.sendNRPN(host.nrpn, host.chan, host.value, host.highResNrpn)
    }
    if (host.note > 0) {
      midi.sendNoteOn(host.note, host.chan, host.velo)
    }
  } else if (host.toggle) {
    if (host.note) {
      midi.sendNoteOff(host.note, host.chan, host.velo)
    }
  }
}

export const Component = {
  // Private internal properties
  _pressed: false,

  // MIDI properties
  chan: 1,
  cc: -1,
  nrpn: '',
  highResNrpn: false,
  value: 0,
  velo: 127,
  note: -1,

  // Display & UX properties
  colour: property('#ffffff'),
  label: '',
  toggle: false,

  render: ({ label, colour, _pressed, chan, cc }) => {
    const bg = _pressed ? `${darkenColour(colour)}` : 'var(--bg)'

    const newStyle = `button {
      background-color: ${bg};
      color: ${colour};
      border-color: ${colour};
    }`

    return html`<button
      onmouseup="${eventReleased}"
      ontouchend="${eventReleased}"
      onmousedown="${eventPressed}"
      ontouchstart="${eventPressed}"
      innerHTML="${formatLabel(label, '', '', chan, cc)}"
    ></button>`.style(css, newStyle)
  }
}

define('midi-button', Component)
