/*
  TouchMIDI v2
  row.js - A simple div with flexbox layout
  Ben Coleman, Dec 2020 
*/

import { html, define, property } from 'hybrids'

export const Component = {
  grow: 1,
  margin: 0,
  border: false,
  colour: property('#ffffff'),
  _direction: 'row',

  render: ({ grow, margin, border, colour, _direction }) => {
    const borderStyle = border ? 'var(--b-width) solid' : 'none'

    const css = `
    :host{
      flex-grow: ${grow};
      margin: ${margin}rem;
      display: flex;
      flex-direction: ${_direction};

    }
    div {
      display: flex;
      flex-direction: ${_direction};
      flex: 1 1;
      border-radius: var(--b-radius);
      border: ${borderStyle}; 
      border-color: ${colour};

    }`

    return html`<div><slot></div>`.style(css)
  }
}

define('group-row', Component)
