import { html, define } from 'hybrids'
import css from './column.css'

export const Component = {
  render: () => html`<div><slot></div>`.style(css)
}

define('group-column', Component)
