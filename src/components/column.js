/*
  TouchMIDI v2
  column.js - A simple div with flexbox layout
  Ben Coleman, Dec 2020 
*/

import { define } from 'hybrids'
import { Component } from './row.js'

// What a lovely little hack, deep clone the exported row component and change one property
var ColumnComponent = Object.assign({}, Component)
ColumnComponent._direction = 'column'

define('group-column', ColumnComponent)
