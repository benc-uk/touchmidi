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

# Config

On loading a loyou

# Getting Started

What you need:

- A supported browser :)
- MIDI device attached to your machine, either directly via USB (e.g. a USB-MIDI based device) or via an audio interface or other MIDI adapter.
- Open one of the [generic example layouts](./layouts)

# Widgets / Controls

## Slider

## Encoder

## Button

## XY Pad

## Counter

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
