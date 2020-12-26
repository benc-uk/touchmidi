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

  render: ({ value, colour, label, min, max, cc, horizontal }) => {
    const percent = Math.round(((value - min) / (max - min)) * 100.0)
    const direction = horizontal ? 'right' : 'top'
    const newStyle = `div {
      background: linear-gradient(to ${direction}, ${colour}60 ${percent}%, var(--bg) ${percent}%);
      color: ${colour};
      border-color: ${colour};
    }`
    return html`<div>${label || value}</div> `.style(css, newStyle)
  }
}

define('midi-slider', Component)

const css = `
  :host {
    flex: 1 1;
    display: flex;
    margin: var(--spacing);
  }
  div {
    font-size: 4vw;
    display: flex;
    flex: 1 1;
    border: var(--b-width) solid;
    border-radius: var(--b-radius);
    justify-content: center;
    align-items: center;
    cursor: pointer;
    overflow: hidden;
    width: 1px;
    user-select: none;
  }
`
