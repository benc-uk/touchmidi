import { html, define } from 'hybrids'
import css from './row.css'

export const Component = {
  grow: 1,
  label: 'Master Levels',

  render: ({ grow, label }) => {
    const newStyle = grow ? `:host{flex: ${grow}} div{ flex: ${grow}}` : ''

    return html`<div><slot></div>`.style(css, newStyle)
  }
}

define('group-row', Component)
