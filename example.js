var rc = require('./piswitch');

// The RC-Switch wiki and related material are very helpful:
//   https://code.google.com/p/rc-switch/

// This library is meant to be compatible, so any device that works with
// RC-Switch for Arduino *should* work here.

// Note that you'll need to export the pin with `gpio export [PIN] out`
// when using 'sys' (non-root) mode, which is recommended.
//   compare: http://wiringpi.com/reference/setup/

rc.setup({
    mode: 'sys', // alternative: change to gpio and use root
    pulseLength: 330,
    protocol: 1
});

if (process.argv.length < 3) { 
  console.log("Usage: node example <code> [<type> [off]]\n"
              + "    e.g., node example ff0f00ffffff tristate");
  return;
}

var code = process.argv[2];
console.log("Code: " + code);

var type, off;

if (typeof process.argv[3] !== undefined) {
  type = process.argv[3]
  console.log("Type declared as: " + type);
}

if (typeof process.argv[4] !== undefined && process.argv[4] === 'off') {
  off = true;
  console.log("Sending OFF ...");
} else {
  console.log("Sending ON ...");
}

rc.send(code, type, off);
