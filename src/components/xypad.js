/*
  TouchMIDI v2
  xypad.js - A widget that acts like a 2D XY pad control, sends MIDI CC or NRPN messages
  Ben Coleman, Dec 2020 
*/

import { html, define, property } from 'hybrids'
import * as midi from '../midi.js'
import { darkenColour, formatLabel, saveWidgetValue, clamp } from '../utils.js'
import css from './xypad.css'

export const Component = {
  // Private internal properties
  _previousPos: null,
  _width: 30,
  _update: {
    observe: (host, update, lastValue) => {
      if (update.restoreValue) {
        host.value = update.restoreValue
        return
      }

      // IMPORTANT! save x & y as previousPos
      host._previousPos = { x: update.x, y: update.y }

      // Work out new value based on dx or dy
      let tempX = host.valueX + update.dx
      let tempY = host.valueY - update.dy

      // Clamp to min and max
      tempX = clamp(tempX, host.min, host.max)
      tempY = clamp(tempY, host.min, host.max)

      // Finally update the value (which will trigger a render)
      host.valueX = Math.round(tempX)
      host.valueY = Math.round(tempY)
    }
  },

  // MIDI properties
  valueX: Number.MIN_SAFE_INTEGER,
  valueY: Number.MIN_SAFE_INTEGER,
  chan: 1,
  ccX: -1,
  ccY: -1,
  min: 0,
  max: 127,

  // Display & UX properties
  colour: property('#ffffff'),
  label: '__unset__',
  labelScale: 1,
  grow: 1,

  render: ({ valueX, valueY, colour, label, min, max, ccX, ccY, chan, nrpn, _width, labelScale, grow }) => {
    // This widget saves state, in two variables
    saveWidgetValue('midi-pad', `${ccX}${chan}${nrpn}X`, valueX)
    saveWidgetValue('midi-pad', `${ccY}${chan}${nrpn}Y`, valueY)

    // Clamp to min and max & calc percentage
    valueX = clamp(valueX, min, max)
    valueY = clamp(valueY, min, max)
    let percentX = Math.round(((valueX - min) / (max - min)) * 100.0)
    let percentY = Math.round(((valueY - min) / (max - min)) * 100.0)

    // Default label is to show the value
    if (label === '__unset__') {
      label = '%v'
    }

    // We use some CSS tricks
    const newStyle = `
    :host {
      flex-grow: ${grow}
    }
    div {
      color: ${colour};
      border-color: ${colour};
    }
    #label {
      font-size: ${_width * 0.4 * labelScale}px;
    }
    #marker {
      background-color: ${darkenColour(colour)};
      border-color: ${colour};
      bottom: calc(${percentY}% - ${_width * 0.05}px);
      left: calc(${percentX}% - ${_width * 0.05}px);
      width: ${_width * 0.1}px;
      height: ${_width * 0.1}px;
    }`

    // Handle MIDI actions, might be CC or NRPN
    if (ccX > 0 && ccY > 0) {
      console.log('p send')
      midi.sendCC(ccX, chan, valueX)
      midi.sendCC(ccY, chan, valueY)
    }

    return html`<div>
      <div id="label" innerHTML="${formatLabel(label, `${valueX},${valueY}`, `${percentX},${percentY}`, chan)}"></div>
      <span id="marker"></span>
    </div>`.style(css, newStyle)
  }
}

define('midi-pad', Component)
