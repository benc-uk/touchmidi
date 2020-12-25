import { html, define, property } from 'https://unpkg.com/hybrids@^4/src'
import { calcDelta } from '../utils.js'

//let oldPos = { x: 0, y: 0 }

// function eventMouseDown(host, evt) {
//   host.active = true
//   oldPos = { x: evt.clientX, y: evt.clientY }
// }

// function eventTouchStart(host, evt) {
//   if (host.touchId >= 0) return
//   const touch = evt.touches[evt.touches.length - 1]
//   console.log('silder eventTouchStart', touch.identifier)
//   host.active = true
//   host.touchId = touch.identifier
//   oldPos = { x: touch.clientX, y: touch.clientY }
//   //console.log(touch.identifier, touch.clientX, touch.clientY)
// }

// function eventMouseUp(host) {
//   host.active = false
// }

// function eventTouchEnd(host) {
//   console.log('silder eventTouchEnd', host.touchId)
//   host.active = false
//   host.touchId = -1
// }

export const Component = {
  delta: {
    observe: (host, delta, lastValue) => {
      // Work out new value based on dx or dy
      var newVal = 0
      if (host.horizontal) newVal = host.value + delta.dx
      else newVal = host.value - delta.dy

      // Clamp to min and max
      if (newVal > host.max) newVal = host.max
      if (newVal < host.min) newVal = host.min
      host.value = Math.round(newVal)
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

  render: ({ value, colour, label, min, max }) => {
    const percent = Math.round(((value - min) / (max - min)) * 100.0)
    const newStyle = `div {
      background: linear-gradient(to top, ${colour}60 ${percent}%, var(--bg) ${percent}%); 
      color: ${colour}; 
      border-color: ${colour};"
    }`
    //return html`<div onmousedown="${eventMouseDown}" onmouseup="${eventMouseUp}" ontouchstart="${eventTouchStart}" ontouchend="${eventTouchEnd}">
    return html`<div>${label || value}</div>`.style(css, newStyle)
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
    font-size: 6vw;
    display: flex;
    flex: 1 1;
    border: var(--b-width) solid;
    border-radius: var(--b-radius);
    justify-content: center;
    align-items: center;
    cursor: pointer;
    overflow: hidden;
    user-select: none;
  }
`
