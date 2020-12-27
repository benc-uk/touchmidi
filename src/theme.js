// Moved here just to keep touchmidi.js clean

export var globalCss = `
:root {
  --bg: black;
  
  --b-radius: 0.7rem;
  --b-width: 0.3rem;
  --spacing: 0.5%;

  --font: Consolas, 'Courier New', monospace
}

html, body {
  height: 100%;
  margin: 0;
  padding: 0;
  overflow-y: hidden;
  color: var(--grey);
  background-color: var(--bg);
  font-family: var(--font);
  touch-action: none;
}

body {
  display: flex;
  flex-direction: column;
}

#pageMask {
  background: rgba(0, 0, 0, 0.8);
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: none;
}`
