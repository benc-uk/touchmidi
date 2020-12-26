import { html, define } from '../hybridsjs/index.js'

export const Component = {
  render: () => html`<div><slot></div>`.style(css)
}

define('group-row', Component)

const css = `
:host {
  display: flex;
  flex: 1 1;
  flex-direction: row;
}
div {
  display: flex;
  flex-direction: row;
  flex: 1 1;
}
`
