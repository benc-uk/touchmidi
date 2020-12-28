import { clamp } from './utils.js'

var access
var midiOut
var globalChannel

export async function getAccess() {
  try {
    if (!access) {
      // First try to get MIDI access, will throw error if fails
      access = await navigator.requestMIDIAccess()
    }
    return access
  } catch (err) {
    console.error('MIDI getAccess failed', err)
    //alert("Unable to get MIDI access\nYour browser doesn't support MIDI, try using Chrome or Edge")
  }
}

// =====================================================================================
// Open given MIDI output device
// =====================================================================================
export function openMIDIPort(deviceId = 'output-1') {
  midiOut = deviceId
}

// =====================================================================================
// Open given MIDI output device
// =====================================================================================
export function setGlobalChannel(channel = 0) {
  globalChannel = channel
}

// =====================================================================================
// Send MIDI note ON
// =====================================================================================
export function sendNoteOn(note, chan = 1, velo = 127) {
  if (!midiOut) return
  const channel = globalChannel > 0 ? globalChannel : chan

  midiOut.send([0x90 + (channel - 1), note, velo])
}

// =====================================================================================
// Send MIDI note OFF
// =====================================================================================
export function sendNoteOff(note, chan = 1, velo = 127) {
  if (!midiOut) return
  const channel = globalChannel > 0 ? globalChannel : chan

  midiOut.send([0x80 + (channel - 1), note, velo])
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

  const parts = nrpn.split(',')
  const lsb = parseInt(parts[0].trim())
  const msb = parseInt(parts[1].trim())

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
