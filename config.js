var defaultConf = {
  pin: 17,          // in BCM numbering, unless mode is 'wpi' or 'phys'
  protocol: 1,
  pulseLength: 350, // in microseconds
  repeats: 10,
  mode: 'sys'       // use exported pins via sys (see wiring-pi)
};

exports.defaults = defaultConf;
