import { html, define } from 'hybrids'
import css from './column.css'

export const Component = {
  grow: 1,

  render: ({ grow }) => {
    const newStyle = grow ? `:host{flex: ${grow}} div{ flex: ${grow}}` : ''

    return html`<div><slot></div>`.style(css, newStyle)
  }
}

define('group-column', Component)
