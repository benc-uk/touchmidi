/*
  TouchMIDI v2
  main.js - App entry point and event input handling
  Ben Coleman, Dec 2020 
*/

// Load custom component widgets
import './components/row.js'
import './components/column.js'
import './components/config.js'
import './components/slider.js'
import './components/encoder.js'
import './components/button.js'
import './components/xypad.js'
import './components/counter.js'
import * as midi from './midi.js'
import { clamp, getWidgetValue } from './utils.js'

import mainCss from './css/main.css'

// Global config consts
const MOVE_CLAMP = 6
const SENSITIVITY = 1
const MOUSE_ID = 20

// A global list of HTML nodes which are being updated (touched or clicked)
let activeWidgets = []

// =============================================================================
// The main entry point is here, after loading the document / page
// =============================================================================
window.addEventListener('load', async () => {
  await pageSetup()
  const access = await midi.getAccess()

  if (!access) {
    document.body.innerHTML = `<div style="text-align: center; font-size: 150%">
    <h1 style="color:#ee2222">Failed to get MIDI access</h1><br>This is likely because your browser doesn't support MIDI or permissions were not granted<br><br>Try again using Chrome or Edge</div>`
    return
  }

  // Start with MIDI config dialog, which needs MIDI access
  // We can bypass this (only for dev & testing really) with special `?nomidi` URL query param
  const urlParams = new URLSearchParams(window.location.search)
  const noMidi = urlParams.get('nomidi')
  if (noMidi === null) openConfigDialog(access)

  // Notify widgets of their real width, used in order to scale fonts on labels
  // Tiny delay timeout prevents it not working sometimes, probably race condition with document loading
  window.addEventListener('resize', updateWidgetWidths)
  setTimeout(updateWidgetWidths, 20)

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
// Set up the page, CSS etc, keeps the HTML free of requirements
// =============================================================================
async function pageSetup() {
  // Mask used for modal config dialog
  const pageMask = document.createElement('div')
  pageMask.id = 'pageMask'
  document.body.append(pageMask)

  // Global main styles
  const style = document.createElement('style')
  style.textContent = mainCss

  // Viewport
  let viewport = document.createElement('meta')
  viewport.setAttribute('name', 'viewport')
  viewport.setAttribute('content', 'width=device-width, user-scalable=no, initial-scale=1.0')
  document.getElementsByTagName('head')[0].appendChild(viewport)

  // Set favicon
  let iconLink = document.querySelector("link[rel~='icon']")
  if (!iconLink) {
    iconLink = document.createElement('link')
    iconLink.rel = 'icon'
    iconLink.href = 'https://raw.githubusercontent.com/benc-uk/touchmidi/main/src/assets/favicon.png'
    document.getElementsByTagName('head')[0].appendChild(iconLink)
  }

  // Inject stylesheet (keeps HTML clean)
  document.head.append(style)
}

// =============================================================================
// Display the initial config setup dialog
// =============================================================================
function openConfigDialog(access) {
  // Create config dialog element and pass it the MIDI access
  const configDialog = document.createElement('midi-config')
  configDialog.midiAccess = access

  // Get settings returned from config dialog (when config-done event fires)
  configDialog.addEventListener('config-done', (evt) => {
    if (!evt.detail || !evt.detail.deviceId) {
      alert('No MIDI device id returned, MIDI output device not opened!')
      return
    }

    // Configure MIDI with global settings
    midi.setup(access.outputs.get(evt.detail.deviceId), evt.detail.globalChannel || 0)
    console.log(`MIDI configured for device '${evt.detail.deviceId}' and channel: ${evt.detail.globalChannel}`)

    // Restore saved values for certain widgets, if
    if (evt.detail.restoreValues) {
      console.log('Restoring saved widget values')
      for (let widget of document.body.querySelectorAll('midi-slider,midi-encoder,midi-pad,midi-counter')) {
        if (widget.tagName.toLowerCase() == 'midi-pad') {
          let savedValX = getWidgetValue(widget, `${widget.ccX}${widget.chan}${widget.nrpn}X`)
          let savedValY = getWidgetValue(widget, `${widget.ccY}${widget.chan}${widget.nrpn}Y`)
          if (savedValX) widget.valueX = savedValX
          if (savedValY) widget.valueY = savedValY
        } else {
          let savedVal = getWidgetValue(widget)
          // By setting the value we trigger a redraw AND a send of the MIDI events
          if (savedVal) widget.value = savedVal
        }
      }
    }
  })

  // Show config dialog element, by adding to the body
  document.body.appendChild(configDialog)
}

// =============================================================================
// Notify all widgets of their current client width
// =============================================================================
function updateWidgetWidths() {
  // TODO: Find a better way of selecting all custom elements / widgets
  for (let widget of document.body.querySelectorAll('midi-slider,midi-encoder,midi-pad,midi-button,midi-counter')) {
    widget._width = widget.clientWidth
  }
}
