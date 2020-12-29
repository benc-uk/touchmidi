/*
  TouchMIDI v2
  row.js - A simple div with flexbox layout
  Ben Coleman, Dec 2020 
*/

import { html, define, property } from 'hybrids'
import css from './row.css'

export const Component = {
  grow: 1,
  margin: 0,
  border: false,
  colour: property('#ffffff'),

  render: ({ grow, margin, border, colour }) => {
    const borderStyle = border ? 'var(--b-width) solid' : 'none'

    const newStyle = `
    :host{
      flex-grow: ${grow};
      margin: ${margin}rem;
    }
    div {
      border: ${borderStyle};
      border-color: ${colour};
    }`

    return html`<div><slot></div>`.style(css, newStyle)
  }
}

define('group-row', Component)
