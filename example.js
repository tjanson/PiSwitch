var rc = require('./piswitch');

// The RC-Switch wiki and related material are very helpful:
//   https://code.google.com/p/rc-switch/

// This library is meant to be compatible, so any device that works with
// RC-Switch for Arduino *should* work here.

// Note that you'll need to export the pin with `gpio export [PIN] out`
// when using 'sys' (non-root) mode, which is recommended.
//   compare: http://wiringpi.com/reference/setup/
//   pin chart: http://pi.gadgetoid.com/pinout/

rc.setup({
    mode: 'sys', // alternative: change to gpio and use root
    pulseLength: 330, // this works for me, but 350 is very common
    protocol: 1
});

if (process.argv.length < 3) { 
  console.log("Usage: node example <code> [<type> [off]]\n"
              + "    e.g., node example ff0f00ffffff tristate");
  return;
}

var code    = process.argv[2];
var type    = process.argv[3];
var offFlag = process.argv[4];
var offMsg  = '';
var off;

if (typeof type === 'undefined') {
  console.log("[INFO] Implicitly declared as binary.");
  type = 'binary';
}

if (typeof offFlag !== 'undefined' && offFlag === 'off') {
  off = true;
  offMsg = '-OFF';
} else if (type !== 'binary' && type !== 'tristate') {
  offMsg = '-ON';
}

console.log("[SEND] " + code + offMsg + " (type declared as: '" + type + "')");
rc.send(code, type, off);
