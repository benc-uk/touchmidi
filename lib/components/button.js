import { html, define, property } from '../hybridsjs/index.js'
import { darkenColour, formatLabel } from '../utils.js'

function eventReleased(host, evt) {
  evt.preventDefault()
  host.pressed = false
}

function eventPressed(host, evt) {
  evt.preventDefault()
  host.pressed = true
}

export const Component = {
  chan: 1,
  cc: 0,
  colour: property('#ffffff'),
  label: '',
  pressed: false,
  toggle: false,

  render: ({ label, colour, pressed, chan, cc }) => {
    const bg = pressed ? `${darkenColour(colour)}` : 'var(--bg)'

    const newStyle = `button {
      background-color: ${bg};
      color: ${colour};
      border-color: ${colour};
    }`

    return html`<button
      onmouseup="${eventReleased}"
      ontouchend="${eventReleased}"
      onmouseleave="${eventReleased}"
      onmousedown="${eventPressed}"
      ontouchstart="${eventPressed}"
      innerHTML="${formatLabel(label, '', '', chan, cc)}"
    ></button>`.style(css, newStyle)
  }
}

define('midi-button', Component)

const css = `
  :host {
    flex: 1 1;
    display: flex;
    margin: var(--spacing);
  }
  button {
    font-family: var(--font);
    background-color: var(--bg);
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
