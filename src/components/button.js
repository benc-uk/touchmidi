/*
  TouchMIDI v2
  button.js - A widget that sends MIDI events when pressed or toggled on/off
  Ben Coleman, Dec 2020 
*/

import { html, define, property } from 'hybrids'
import * as midi from '../midi.js'
import { darkenColour, formatLabel } from '../utils.js'
import css from './button.css'

function eventReleased(host, evt) {
  evt.preventDefault()
  if (!host.toggle && host._pressed) {
    host._pressed = false

    if (host.note > 0) {
      midi.sendNoteOff(host.note, host.chan)
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
      midi.sendNRPN(host.nrpn, host.chan, host.value, host.nrpnHires)
    }
    if (host.note > 0) {
      midi.sendNoteOn(host.note, host.chan, host.velo)
    }
  } else if (host.toggle) {
    if (host.note > 0) {
      midi.sendNoteOff(host.note, host.chan)
    }
    if (host.cc > 0 && host.valueOff) {
      midi.sendCC(host.cc, host.chan, host.valueOff)
    }
    if (host.nrpn && host.valueOff) {
      midi.sendNRPN(host.nrpn, host.chan, host.valueOff, host.nrpnHires)
    }
  }
}

export const Component = {
  // Private internal properties
  _pressed: false,
  _width: 30,

  // MIDI properties
  chan: 1,
  cc: -1,
  nrpn: '',
  nrpnHires: false,
  value: 0,
  valueOff: 0,
  velo: 127,
  note: -1,

  // Display & UX properties
  colour: property('#ffffff'),
  label: '__unset__',
  toggle: false,
  labelScale: 1,
  grow: 1,

  render: ({ label, colour, _pressed, chan, cc, nrpn, note, _width, labelScale, grow }) => {
    const bg = _pressed ? `${darkenColour(colour)}` : 'var(--bg)'

    // Default label is to show the value
    if (label === '__unset__') {
      if (note > 0) label = '%n'
      else if (cc > 0) label = '%t'
      else if (nrpn) label = nrpn
    }

    const newStyle = `
    :host {
      flex-grow: ${grow}
    }
    button {
      background-color: ${bg};
      color: ${colour};
      border-color: ${colour};
      font-size: ${_width * 0.4 * labelScale}px !important;
    }`

    return html`<button
      onmouseup="${eventReleased}"
      ontouchend="${eventReleased}"
      onmousedown="${eventPressed}"
      ontouchstart="${eventPressed}"
      onmouseleave="${eventReleased}"
      innerHTML="${formatLabel(label, '', '', chan, cc, note)}"
    ></button>`.style(css, newStyle)
  }
}

define('midi-button', Component)
