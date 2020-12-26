import { html, define, property } from '../hybridsjs/index.js'

function released(host, evt) {
  evt.preventDefault()
  console.log('rel')
}

function pressed(host, evt) {
  evt.preventDefault()
  console.log('press')
}

export const Component = {
  chan: 0,
  cc: 0,
  colour: property('#ffffff'),
  label: '',

  render: ({ label, colour }) => {
    return html`<button
      style="border-color:${colour}; color:${colour}"
      onmouseup="${released}"
      ontouchend="${released}"
      onmouseleave="${released}"
      onmousedown="${pressed}"
      ontouchstart="${pressed}"
    >
      ${label}
    </button>`.style(css)
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
