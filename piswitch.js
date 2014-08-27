/*
 * PiSwitch.js - RC-Switch for Raspberry Pi
 * usage: see README.md
 *
 * Inspired by RC-Switch for Arduino:
 *   https://code.google.com/p/rc-switch/
 *
 * Adapted for node and Raspberry Pi by tjanson:
 *   https://github.com/tjanson/PiSwitch
 */
var wpi    = require('wiring-pi');
var config = require('./config.js').defaults;
var dict   = require('./dict.js');

var firstInit = true;

/*
 * needs to be called once to initialize wiring-pi
 * on repeated calls, previous values will persist unless overwritten
 */
function setup(opts) {
  oldPin  = config.pin;
  oldMode = config.mode;

  for (var key in opts) {
    config[key] = (opts[key] !== undefined) ? opts[key] : config[key];
  }

  if (firstInit) {
    wpi.setup(config.mode);
    firstInit = false;
  } else {
    if (oldMode !== config.mode) {
      // not sure if this would lead to problems, so let's just forbid it
      console.warn("WARN [transmitter.js] mode change ignored; mode is final");
      config.mode = oldMode;
    }
    if (oldPin !== config.pin) {
      wpi.pinMode(oldPin, wpi.INPUT);
    }
  }

  wpi.pinMode(config.pin, wpi.OUTPUT);
}

/*
 * input must be one of:
 *   - binary code,
 *   - tristate,
 *   - correctly declared manufacturer code
 */
function send(code, type, off) {
  if (typeof code !== 'string') {
    console.error("ERROR [piswitch.js] send() requires string");
    return;
  }

  if (typeof type === 'undefined') { // :)
    type = 'binary'
  }

  if (typeof type !== 'string'
      || (type !== 'binary' && type !== 'tristate'
          && typeof dict.types[type] === 'undefined')
     ) {
    console.error("ERROR [piswitch.js] unknown code type: " + type);
  }

  code = code.toLowerCase();

  // check against regexp patterns and reject non-matches
  var pattern;
  if (type === 'binary') {
    pattern = /^[01]*$/;
  } else if (type === 'tristate') {
    pattern = /^[01f]*$/;
  } else {
    pattern = dict.types[type].regexp;
  }
  if (!pattern.test(code)) {
    console.error("ERROR [piswitch.js] bad input (type: " + type + ")");
    return;
  }

  // translate as necessary
  if (type === 'binary') {
    code = code.split('');
  } else if (type === 'tristate') {
    code = triToBin(code);
  } else if (type !== 'binary') {
    code = manufacturerToBin(code, type, off);
  }

  // transmission consists of repeated binary code
  // plus 'sync' signals before, in-between, and after
  transmission = ['s'];
  for (var i = 0; i < config.repeats; i++) {
    transmission = transmission.concat(code, 's');
  }
  transmit(binToWave(transmission));
}

function manufacturerToBin(code, type, off) {
  var d = dict.types[type];
  var format = d.format;
  var tristate = '';

  // the code often consists of several digit groups with
  // different translation schemes
  // the character `code[i]` belongs to digit group `format[i]`
  // and the translation is found in `map[group][char]`
  for (var i = 0; i < format.length; i++) {
    tristate += d.map[format[i]][code[i]];
  }

  tristate += (typeof off !== 'undefined' && off) ? d.off : d.on;

  return triToBin(tristate);
}

function triToBin(code) {
  return convert(code, dict.tribit);
}

function binToWave(code) {
  return convert(code, dict.wave[config.protocol]);
}

function convert(code, mapping) {
  return flatten(Array.prototype.map.call(code, function(token){
    return mapping[token];
  }));
}

// flattens one depth
function flatten(array) {
  var flattened = [];
  for (var i = 0; i < array.length; ++i) {
    var current = array[i];
    for (var j = 0; j < current.length; ++j) {
        flattened.push(current[j]);
    }
  }
  return flattened;
}

/*
 * accepts an array of numbers, which represent the delay before
 * switching from HIGH to LOW or vice-versa
 * 
 * e.g.: transmit([1,3,1,1]) will produce this waveform: ^|___|^|_
 */
function transmit(wave) {
  level = wpi.HIGH;

  for (var i = 0; i < wave.length; i++) {
    wpi.digitalWrite(config.pin, level);
    wpi.delayMicroseconds(config.pulseLength * wave[i]);
    level = (level === wpi.HIGH) ? wpi.LOW : wpi.HIGH;
  }
}

exports.setup = setup;
exports.send  = send;
