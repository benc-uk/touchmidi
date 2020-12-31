# Touch MIDI

Touch MIDI is a flexible MIDI control surface for touch based devices using HTML5.  
The project consists of a set of custom HTML elements which allows the user to build a simple HTML page which acts as a MIDI controller. The elements represent various controls such as sliders and buttons, and can be configured to send MIDI messages.

It supports a range of MIDI messages such as CC (continuous controller), notes on & off, and NRPN (non-registered parameter number).

This ground up rewrite of my older [Touch MIDI project](https://github.com/benc-uk/touchmidi-old). It has been rewritten using web components (using Hybrids.js as a library), ES6 modules, WebPack and a much cleaner design.

Core technologies:

- [Web MIDI API](https://www.w3.org/TR/webmidi/)
- [Web Components & custom elements](https://developer.mozilla.org/en-US/docs/Web/Web_Components)
- Various modern web features: ES6 modules, SVG, ES6 DOM APIs, CSS3

Design goals:

- No backend or server required
- Works 100% in browser (client JS)
- Works with both and touch screen devices
- Supports multiple touches at the same time
- Layout HTML files can be opened and run from local `file://` URL

# Supported Browsers

Although the Web MIDI API spec isn't new (it was drafted in 2015) support for it is currently [limited to Chrome, Edge and Opera](https://caniuse.com/?search=midi)

Mobile Chrome on an Android device has also been tested as working

# User Guide

Getting started, you'll need:

- A supported browser :)
- MIDI device attached to your machine, either directly via USB (e.g. a USB-MIDI based device) or via an audio interface or other MIDI adapter.
- Open one of the [generic example layouts](./layouts)

Upon opening the layout HTML, a configuration dialog will be shown, which allows the setup of some MIDI & other settings:

- **MIDI device** - A list of all attached MIDI output devices will be shown, one must be selected before you can close the config dialog and start the layout. This setting will be remembered for this layout file (HTML filename)
- **MIDI channel** - Layout files can be designed to support multiple MIDI channels or a single global MIDI channel. You have two choices:
  - If a MIDI channel number is set here it will be used by _all controls_ in the layout. Pick this when controlling a single device which responds on a single channel (i.e. is mono-timbral)
  - A special option 'Set By Layout' can be picked, which defers all channel settings to the layout HTML file, and this sets what channel is used on a _per control basis_ (the default is channel 1 if it's not specified). This allows for both multi-timbral control of a device, and multi-device control
- **Save & Restore at Startup** - When enabled the values of certain controls (sliders, encoders and XY pads) are saved when they are changed, and reloaded at startup. In addition MIDI messages are sent at startup, sending the saved values, in order to set the device(s) to the same state as they were previously. This can act as a form of preset saving, however this feature can have some side effects, so is not enabled by default.
- **Start Fullscreen** - When enabled the browser will switch to fullscreen mode

# Widgets / Controls

## Slider

## Encoder

## Button

## XY Pad

## Counter

# Known Issues

# Developer Guide

## Getting Started

All you need to include in the HTML is the bundled JavaScript in the HTML head, this is served from the jsDelivr CDN, e.g. `https://cdn.jsdelivr.net/gh/benc-uk/touchmidi@v1.0.0/dist/bundle.js`

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Touch Midi 2 [My Layout]</title>
    <script src="https://cdn.jsdelivr.net/gh/benc-uk/touchmidi@v1.0.0/dist/bundle.js"></script>
  </head>
  <body>
    <!-- PUT YOUR WIDGETS HERE -->
  </body>
</html>
```

Create an empty HTML file and paste the contents below.  
Note. You can specify any version (see [releases](./releases)) after the @
