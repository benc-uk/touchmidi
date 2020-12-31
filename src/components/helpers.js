/*
  TouchMIDI v2
  helpers.js - Very simple helpers like spacers and labels
  Ben Coleman, Dec 2020 
*/

import { html, define } from 'hybrids'

export const SpacerComponent = {
  grow: 1,

  render: ({ grow }) => {
    const css = `
    :host{
      flex: ${grow} 1;
    }
    div {
      flex ${grow} 1;
    }`

    return html`<div></div>`.style(css)
  }
}
define('midi-spacer', SpacerComponent)

// ==========================================================================

export const LabelComponent = {
  grow: 1,

  render: ({ grow }) => {
    const css = `
    :host{
      flex: ${grow} 1;
    }
    div {
      flex ${grow} 1;
      font-size: 4vw;
    }`

    return html`<div><slot></div>`.style(css)
  }
}
define('midi-label', LabelComponent)
