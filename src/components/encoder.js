import { html, define, property } from '../hybridsjs/index.js'
import * as midi from '../midi.js'
import { formatLabel } from '../utils.js'

export const Component = {
  // Private internal properties
  _previousPos: null,
  _update: {
    observe: (host, newValue, lastValue) => {
      host._previousPos = { x: newValue.x, y: newValue.y }
      // Work out new value based on dx or dy
      var tempValue = 0
      if (host.horizontal) tempValue = host.value + newValue.dx
      else tempValue = host.value - newValue.dy
      // Clamp to min and max
      if (tempValue > host.max) tempValue = host.max
      if (tempValue < host.min) tempValue = host.min
      host.value = Math.round(tempValue)
    }
  },

  // MIDI properties
  value: 0,
  chan: 1,
  cc: -1,
  nrpn: '',
  min: 0,
  max: 127,

  // Display & UX properties
  colour: property('#ffffff'),
  label: '__unset__',
  horizontal: false,

  render: ({ value, colour, label, min, max, chan, cc, nrpn }) => {
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
    if (cc) {
      midi.sendCC(cc, chan, value)
    }
    if (nrpn) {
      midi.sendNRPN(nrpn, chan, value, max > 127)
    }

    return html`<div>
      <svg viewBox="0 0 36 36">
        <path
          d="M18 2.0
a 16 16 0 0 1 0 32
a 16 16 0 0 1 0 -32"
          fill="none"
          stroke="${colour}"
          stroke-opacity="0.3"
          stroke-width="0.25rem"
          stroke-dasharray="75, 100"
          transform="rotate(226 18 18)"
          stroke-linecap="round"
        />
        <path
          d="M18 2.0
a 16 16 0 0 1 0 32
a 16 16 0 0 1 0 -32"
          fill="none"
          stroke="${colour}"
          stroke-width="0.25rem"
          stroke-dasharray="${valLength}, 100"
          transform="rotate(226 18 18)"
          stroke-linecap="round"
        />
      </svg>
      <div class="label" style="color: ${colour}" innerHTML="${formatLabel(label, value, percent, chan, cc)}"></div>
    </div>`.style(css)
  }
}

define('midi-encoder', Component)

const css = `
  :host {
    flex: 1 1;
    display: flex;
    margin: var(--spacing);
  }
  svg {
    width: 100%;
    height: 100%;
  }
  div {
    color: white;
    font-size: 6vw;
    display: flex;
    flex: 1 1;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    overflow: hidden;
    user-select: none;
    position: relative;
    margin: auto;
  }
  .label {
    position: absolute ;
    z-index: 40;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    line-height: 0.9em;
  }
`
