var rc = require('./piswitch');

// This is just an example, of course. You'll need to figure out what codes
// and settings work for you.

// The RC-Switch wiki and related material are very helpful:
//   https://code.google.com/p/rc-switch/

// This library is meant to be compatible, so any device that works with
// RC-Switch for Arduino *should* work here.

// Sending codes in the "house code" format is not implemented yet, but they
// can be converted to binary (or tristate).

const on  = 'ff0f00ffffff';
const off = 'ff0f00fffff0';

rc.setup({
    mode: 'sys', // alternative: change to gpio and use root
    pulseLength: 330
});

console.log("Ready. Note that you'll need to export the pin with"
            + " `gpio export [PIN] out` when using 'sys' (non-root)"
            + " mode, which is recommended.\n"
            + " Compare: http://wiringpi.com/reference/setup/");

if (process.argv[2] == 'off') {
  console.log("Sending OFF ...");
  rc.send(off, { type: 'tristate' });
} else {
  console.log("Sending ON ... (also try `node example off`)");
  rc.send(on,  { type: 'tristate' });
}
