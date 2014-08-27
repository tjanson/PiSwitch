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

var socketTypes = {
  // referred to as 'type A' in RCSwitch.cpp
  'dip': {
    'format': 'AAAAAAAAAA', // first 5: group, then: device
    'regexp': /^[01]{10}$/,
    'map': {
      'A': {
        '0': 'f',
        '1': '0'
      }
    },
    'on': '0f',
    'off': 'f0'
  },
  // referred to as 'type B' in RCSwitch.cpp
  'rotary': {
    'format': 'AA', // first 4: group, then: device
    'regexp': /^[1-4]{2}$/,
    'map': {
      'A': {
        '1': '0fff',
        '2': 'f0ff',
        '3': 'ff0f',
        '4': 'fff0'
      }
    },
    'on': 'ffff',
    'off': 'fff0'
  },
  // referred to as 'type C' in RCSwitch.cpp
  'intertechno': {
    'format': 'ABB', // family, group, device
    'regexp': /^[a-p][1-4]{2}$/,
    'map': {
      'A': {
        'a': '0000',
        'b': 'f000',
        'c': '0f00',
        'd': 'ff00',
        'e': '00f0',
        'f': 'f0f0',
        'g': '0ff0',
        'h': 'fff0',
        'i': '000f',
        'j': 'f00f',
        'k': '0f0f',
        'l': 'ff0f',
        'm': '00ff',
        'n': 'f0ff',
        'o': '0fff',
        'p': 'ffff'
      },
      'B': {
        '1': '00',
        '2': '0f',
        '3': 'f0',
        '4': 'ff'
      }
    },
    'on': '0fff',
    'off': '0ff0'
  },
  // referred to as 'type D' in RCSwitch.cpp
  'rev': {
    'format': 'AB',
    'regexp': /^[a-d][123]$/,
    'map': {
      'A': {
        'a': '1fff',
        'b': 'f1ff',
        'c': 'ff1f',
        'd': 'fff1'
      },
      'B': {
        '1': '1ff',
        '2': 'f1f',
        '3': 'ff1',
      }
    },
    'on': '00010',
    'off': '00001'
  }
};

exports.wave   = wave;
exports.tribit = tribit;
exports.types  = socketTypes;
