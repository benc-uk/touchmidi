import { html, define } from 'hybrids'
import css from './row.css'

export const Component = {
  render: () => html`<div><slot></div>`.style(css)
}

define('group-row', Component)
