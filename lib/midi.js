export var access
var midiOut

export async function init() {
  try {
    // First try to get MIDI access, will throw errors if fails
    access = await navigator.requestMIDIAccess()
    const configDialog = document.createElement('midi-config')

    // Get device id returned from config dialog (when config-done event fires)
    configDialog.addEventListener('config-done', (evt) => {
      if (!evt.detail || !evt.detail.deviceId) {
        alert('No MIDI device id returned, MIDI output device not opened!')
        return
      }
      console.log(evt.detail)
      // Get the MIDI output matching the device id we got
      midiOut = access.outputs.get(evt.detail.deviceId)
      sendNoteOn(1, 23, 127)
    })

    // Show config dialog
    document.body.appendChild(configDialog)
  } catch (err) {
    console.log(err)
    alert("Unable to call requestMIDIAccess()\nYour browser doesn't support MIDI, try using a modern browser")
  }
}

// =====================================================================================
// Send MIDI note ON
// =====================================================================================
export function sendNoteOn(chan, note, velocity) {
  if (!midiOut) return

  midiOut.send([0x90 + (chan - 1), note, velocity])
}
