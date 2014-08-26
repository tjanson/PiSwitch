var defaultConf = {
  pin: 17,          // in BCM numbering, unless mode is 'wpi' or 'phys'
  protocol: 1,
  pulseLength: 350, // in microseconds
  repeats: 10,
  mode: 'gpio'      // use gpio instead of root (see wiring-pi)
};

exports.defaults = defaultConf;
