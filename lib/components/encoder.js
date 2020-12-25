import { html, define } from 'https://unpkg.com/hybrids@^4/src'
import { calcDelta } from '../utils.js'

let oldPos = { x: 0, y: 0 }

function eventMouseDown(host, evt) {
  host.active = true
  oldPos = { x: evt.clientX, y: evt.clientY }
}

function eventMouseUp(host) {
  host.active = false
  host.touchId = null
}

export const Component = {
  pos: {
    observe: (host, newValue, lastValue) => {
      if (host.active) {
        var d = calcDelta(oldPos, newValue)

        // Work out new value based on dx or dy
        var newVal = 0
        if (host.horizontal) newVal = host.value + d.x
        else newVal = host.value - d.y

        // Clamp to min and max
        if (newVal > host.max) newVal = host.max
        if (newVal < host.min) newVal = host.min
        host.value = Math.round(newVal)
      }
    }
  },

  active: false,
  value: 0,
  chan: 0,
  cc: 0,
  min: 0,
  max: 127,
  colour: '#ffffff',
  label: '',
  touchId: null,

  render: ({ value, colour, label, min, max }) => {
    const valLength = ((value - min) / (max - min)) * 75.0

    return html`<div onmousedown="${eventMouseDown}" onmouseup="${eventMouseUp}">
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
      <div class="label" style="color: ${colour}">${value}</div>
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
  }
`
