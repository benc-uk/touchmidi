/*
    TouchMIDI v2
    Ben Coleman, Dec 2020 
*/

import * as midi from './midi.js'

import './components/row.js'
import './components/column.js'
import './components/config.js'
import './components/slider.js'
import './components/encoder.js'
import './components/button.js'
import { clamp } from './utils.js'

import mainCss from './css/main.css'

const MOVE_CLAMP = 12
const SENSITIVITY = 1
const MOUSE_ID = 20

// A global list of HTML nodes which are being updated (touched)
let activeWidgets = []

// The main entry point is here
window.addEventListener('load', async () => {
  await pageSetup()
  midi.init()

  // Why so many event listeners?! Basically to get the behaviour we need
  // Mainly to allow moving a widget once the mouse or touch moves outside it
  window.addEventListener('mousedown', eventMouseDown, false)
  window.addEventListener('mousemove', eventMouseMove, false)
  window.addEventListener('mouseup', eventMouseUp, false)
  window.addEventListener('touchstart', eventTouchStart, false)
  window.addEventListener('touchmove', eventTouchMove, false)
  window.addEventListener('touchend', eventTouchEnd, false)
  window.addEventListener('dblclick', eventSinkHole, false)
  window.addEventListener('contextmenu', eventSinkHole, false)
})

// Handle multiple touches and track which ones to send updates to
function eventTouchStart(evt) {
  for (let touch of evt.changedTouches) {
    activeWidgets[touch.identifier] = touch.target
  }
}
function eventTouchMove(evt) {
  for (let touch of evt.changedTouches) {
    updateWidget(touch.target, touch.screenX, touch.screenY)
  }
}
function eventTouchEnd(evt) {
  for (let touch of evt.changedTouches) {
    activeWidgets.splice(touch.identifier, 1)
  }
}

// Mouse events are also tracked but there's only ever only one
function eventMouseDown(evt) {
  activeWidgets[MOUSE_ID] = evt.target
}
function eventMouseMove(evt) {
  updateWidget(activeWidgets[MOUSE_ID], evt.screenX, evt.screenY)
}
function eventMouseUp(evt) {
  activeWidgets.splice(MOUSE_ID, 1)
}

// =============================================================================
// Logic to calculate how much the user has moved the mouse or touch-point
// Then update the widget with the deltas and store the previous position
// =============================================================================
function updateWidget(widget, x, y) {
  if (!widget) return
  let dx = 0
  let dy = 0
  if (widget._previousPos) {
    dx = x - widget._previousPos.x
    dy = y - widget._previousPos.y
    dx = clamp(dx, -MOVE_CLAMP, MOVE_CLAMP) / SENSITIVITY
    dy = clamp(dy, -MOVE_CLAMP, MOVE_CLAMP) / SENSITIVITY
  }

  // This is fairly hacky as we can't expose functions on custom elements
  widget._update = { dx, dy, x, y }
}

// =============================================================================
// For events I want to disable, such as right & double click
// =============================================================================
function eventSinkHole(evt) {
  evt.preventDefault()
}

// =============================================================================
// Set up the page, CSS and other base elements, keeps the HTML clean
// =============================================================================
async function pageSetup() {
  // Mask used for modal config dialog
  const pageMask = document.createElement('div')
  pageMask.id = 'pageMask'
  document.body.append(pageMask)

  // Global main styles
  const style = document.createElement('style')
  style.textContent = mainCss

  // Set favicon
  let iconLink = document.querySelector("link[rel~='icon']")
  if (!iconLink) {
    iconLink = document.createElement('link')
    iconLink.rel = 'icon'
    iconLink.href = 'https://raw.githubusercontent.com/benc-uk/touchmidi2/main/src/assets/favicon.png'
    document.getElementsByTagName('head')[0].appendChild(iconLink)
  }

  // Inject stylesheet (keeps HTML clean)
  document.head.append(style)
}
