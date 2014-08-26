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

exports.wave = wave;
exports.tribit = tribit;
