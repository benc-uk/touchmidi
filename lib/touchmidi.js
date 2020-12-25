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
import { clamp } from './utils.js'

import { globalCss } from './theme.js'

const MOVE_CLAMP = 6
const MOUSE_ID = 11

let activeWidgets = []

// Set everything up here
window.addEventListener('load', () => {
  pageSetup()
  //midi.init()

  // All the listeners we need
  window.addEventListener('mousedown', eventMouseDown, false)
  window.addEventListener('mousemove', eventMouseMove, false)
  window.addEventListener('mouseup', eventMouseUp, false)
  window.addEventListener('touchstart', eventTouchStart, false)
  window.addEventListener('touchmove', eventTouchMove, false)
  window.addEventListener('touchend', eventTouchEnd, false)
  window.addEventListener('dblclick', eventSinkHole, false)
  window.addEventListener('contextmenu', eventSinkHole, false)
})

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

// =============================================================================
// Logic to calculate how much the user has moved the mouse or touch-point
// =============================================================================
function updateWidget(widget, x, y) {
  if (!widget) return
  let dx = 0
  let dy = 0
  if (widget.previousPos) {
    dx = x - widget.previousPos.x
    dy = y - widget.previousPos.y
    dx = clamp(dx, -MOVE_CLAMP, MOVE_CLAMP)
    dy = clamp(dy, -MOVE_CLAMP, MOVE_CLAMP)
  }

  widget.previousPos = { x, y }
  widget.delta = { dx, dy }
}

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
// For events I want to disable, such as right & double click
// =============================================================================
function eventSinkHole(evt) {
  evt.preventDefault()
}

function pageSetup() {
  // Mask used for modal dias
  const pageMask = document.createElement('div')
  pageMask.id = 'pageMask'
  document.body.append(pageMask)

  // Global styles
  const style = document.createElement('style')
  style.textContent = globalCss

  // Inject stylesheet (keeps HTML clean)
  document.head.append(style)
}
