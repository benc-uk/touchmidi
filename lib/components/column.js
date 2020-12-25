import { html, define } from 'https://unpkg.com/hybrids@^4/src'

export const Component = {
  render: () => html`<div><slot></div>`.style(css)
}

define('group-column', Component)

const css = `
:host {
  display: flex;
  flex-direction: column;
  flex: 1 1;
}
div {
  display: flex;
  flex-direction: column;
  flex: 1 1;
}
`
