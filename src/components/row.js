/*
  TouchMIDI v2
  row.js - A simple div with flexbox layout
  Ben Coleman, Dec 2020 
*/

import { html, define } from 'hybrids'
import css from './row.css'

export const Component = {
  grow: 1,

  render: ({ grow }) => {
    const newStyle = grow ? `:host{flex: ${grow}} div{ flex: ${grow}}` : ''

    return html`<div><slot></div>`.style(css, newStyle)
  }
}

define('group-row', Component)
