import { clamp } from './utils.js'

export var access
var midiOut
var globalChannel

export async function init() {
  try {
    // First try to get MIDI access, will throw errors if fails
    access = await navigator.requestMIDIAccess()
    const configDialog = document.createElement('midi-config')

    // Get settings returned from config dialog (when config-done event fires)
    configDialog.addEventListener('config-done', (evt) => {
      if (!evt.detail || !evt.detail.deviceId) {
        alert('No MIDI device id returned, MIDI output device not opened!')
        return
      }

      // Get the MIDI output matching the device id we got
      midiOut = access.outputs.get(evt.detail.deviceId)
      // Global MIDI channel (disabled if 0)
      globalChannel = evt.detail.globalChannel
    })

    // Show config dialog
    document.body.appendChild(configDialog)
  } catch (err) {
    console.error(err)
    alert("Unable to get MIDI access\nYour browser doesn't support MIDI, try using a modern browser")
  }
}

// =====================================================================================
// Send MIDI note ON
// =====================================================================================
export function sendNoteOn(note, chan = 1, velo = 127) {
  console.log('NODE ON ' + note)
  if (!midiOut) return
  const channel = globalChannel > 0 ? globalChannel : chan

  midOut.send([0x90 + (channel - 1), note, velo])
}

// =====================================================================================
// Send MIDI note OFF
// =====================================================================================
export function sendNoteOff(note, chan = 1, velo = 127) {
  console.log('NODE OFF ! ' + note)
  if (!midiOut) return
  const channel = globalChannel > 0 ? globalChannel : chan

  midOut.send([0x80 + (channel - 1), note, velo])
}

// =====================================================================================
// Send MIDI controller change
// =====================================================================================
export function sendCC(cc, chan = 1, val = 0) {
  if (!midiOut) return
  const channel = globalChannel > 0 ? globalChannel : chan
  val = clamp(val, 0, 127)

  midiOut.send([0xb0 + (channel - 1), cc, val])
}

// =====================================================================================
// Send series of messages for a NRPN change
// =====================================================================================
export function sendNRPN(nrpn, chan = 1, val = 0, highRes = false) {
  if (!midiOut) return

  const { lsb, msb } = parseNRPN(nrpn)

  midiOut.send([0xb0 + (chan - 1), 0x63, msb])
  midiOut.send([0xb0 + (chan - 1), 0x62, lsb])

  // Handling of high res values (e.g. greater than 127 or 14-bits)
  // This has been tested on a Novation Ultranova, not sure if this is MIDI standard
  if (highRes) {
    const val_msb = Math.floor(val / 128)
    const val_lsb = Math.floor(val % 128)
    midiOut.send([0xb0 + (chan - 1), 0x06, val_msb])
    midiOut.send([0xb0 + (chan - 1), 0x26, val_lsb])
  } else {
    midiOut.send([0xb0 + (chan - 1), 0x06, val])
  }
}

// =====================================================================================
// Send MIDI program change with bank select
// =====================================================================================
export function sendProgChange(chan, msb, lsb, num) {
  if (!this.midi_out) return

  this.midi_out.send([0xb0 + (chan - 1), 0x00, msb])
  this.midi_out.send([0xb0 + (chan - 1), 0x20, lsb])
  this.midi_out.send([0xc0 + (chan - 1), num])
}
