import { html, define, property } from '../hybridsjs/index.js'

export const Component = {
  update: {
    observe: (host, newValue, lastValue) => {
      host.previousPos = { x: newValue.x, y: newValue.y }
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
  value: 0,
  chan: 0,
  cc: 0,
  min: 0,
  max: 127,
  previousPos: null,
  colour: property('#ffffff'),
  label: '',
  horizontal: false,

  render: ({ value, colour, label, min, max }) => {
    const valLength = ((value - min) / (max - min)) * 75.0

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
      <div class="label" style="color: ${colour}">${label || value}</div>
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
