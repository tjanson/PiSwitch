/*
 * PiSwitch.js - RC-Switch for Raspberry Pi
 * usage: see README.md
 *
 * Inspired by RC-Switch for Arduino:
 *   https://code.google.com/p/rc-switch/
 *
 * Adapted for node and Raspberry Pi by tjanson:
 *   https://<github repo here>
 */
var wpi = require('wiring-pi');

var config = {
  pin:          17, // default: BCM numbering, depending on wPi setup()
  protocol:      1,
  pulseLength: 350, // in microseconds
  repeats:      10,
  mode:     'gpio', // see wiring-pi
  firstInit:  true
}

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

  if (config.firstInit) {
    wpi.setup(config.mode);
    config.firstInit = false;
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
 * wave[protocol][token]:
 *
 * array-tuple of [highs, lows] so that sending HIGH for
 * (highs * pulseLength) followed by LOW for (lows * pulseLength)
 * microsecs corresponds to the given token in a given protocol
 */
var wave = {
  '1': {
    '0': [1, 3],
    '1': [3, 1],
    's': [1,31]
  },
  '2': {
    '0': [1, 2],
    '1': [2, 1],
    's': [1,10]
  },
  '3': {
    '0': [4,11],
    '1': [9, 6],
    's': [1,71]
  }
};

// tribit: represents two binary bits
var tribit = {
  '0': '00',
  '1': '11',
  'f': '01'
};

// input must be a string, case-insensitive
// input declared as 'tristate' will be converted to binary
// any character that's not in the dictionary will be ignored silently
function send(code, opts) {
  if (typeof code !== 'string') {
    console.error("ERROR [transmitter.js] send() requires string");
    return;
  }

  code = code.toLowerCase();   // insensitive
  code = sanitize(code, opts); // strips any chars but 0,1[,f if tricode]
  code = code.split('');       // use array from now on

  if (opts !== undefined && opts.type === 'tristate') {
    code = triToBin(code);
  }

  sendBinary(code);
}

function sanitize(code, opts) {
  var oldCode = code;
  if (opts !== undefined && opts.type === 'tristate') {
    code = code.replace(/[^01f]/g, '');
  } else {
    code = code.replace(/[^01]/g, '');
  }
  if (oldCode !== code) {
    console.warn("WARN [transmitter.js] input was unclean, sending anyway");
  }
  return code;
}

/*
 * prepares transmission, which consists of repeated binCode,
 * plus 'sync' signals before, in-between, and after
 * (not sure if this is exactly spec, but it works for me)
 */
function sendBinary(binCode) {
  transmission = ['s'];
  for (var i = 0; i < config.repeats; i++) {
    transmission = transmission.concat(binCode, 's');
  }
  transmit(binToWave(transmission));
}

function triToBin(triCode) {
  return convert(triCode, function(token){ return tribit[token]; });
}

function binToWave(binCode) {
  return convert(binCode, function(token){ return wave[config.protocol][token]; });
}

function convert(code, mapping) {
  return flatten(code.map(mapping));
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
 * e.g.: transmit([1,3,1,1,3]) will produce this waveform: _|^^^|_|^|___
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
