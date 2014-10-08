PiSwitch
========

Use your Raspberry Pi to control 433 MHz RC power sockets.
Inspired by [RC-Switch][rcs] for Arduino.

PiSwitch is also available as an [`npm` package][npm].

I'm not able to test all code types, so if you encounter a problem, let me
know. Issues and PRs welcome.

[rcs]: https://code.google.com/p/rc-switch/
[npm]: https://www.npmjs.org/package/piswitch

Features
--------

* compatibility with RC-Switch, i.e., supports the same devices
* code input in binary, tristate, and the following schemes:
     - 10 DIP switches (matching the regular expression `/^[01]{10}$/`)
     - two (often rotary) switches with 4 positions (`/^[1-4]{2}$/`)
     - Intertechno (`/^[a-p][1-4]{2}$/`)
     - REV (`/^[a-d][123]$/`)
* easily extendable translation procedure with [JSON dictionary][dict]

[dict]: https://github.com/tjanson/PiSwitch/blob/master/dict.js

Installation & Usage
--------------------

### Hardware

Attach your 433 MHz transmitter to VCC, GND, and a pin of your liking.

### Software

1. Run `npm install` in the project directory to install PiSwitch’s dependencies.

2. Choose between running as PiSwitch with `root` privileges or using the
   WiringPi [`gpio`][gpio-util] utility to `export` the GPIO pins, making
   them accessible to non-root users.

   (This is precisely the choice you have to make when using
   [Wiring Pi’s setup methods][wpi-setup], because that *is* what’s used.)

   Running as an unprivileged user is recommended and the default, so please
   have a look at the `gpio` util’s documentation.
   The relevant command is `gpio export <pin> out` (BCM numbering).
   (Take a look at `gpio readall` and [Gadgetoid’s Pi pinout chart][pinout] for
   pin numbers, both are really handy.)
   
   If you would rather run as root, pass `mode: 'gpio'` during setup (see below).

3. Now take a look at [`example.js`][example-js]. Note:
   * `setup()` must be called to initialize WiringPi. You'll probably want to
     to pass key–value option pairs (e.g., `{ pulseLength: 350, pin: 27 }`) that
     match your setup. See [`config.js`][config-js].

   * `send(code, type, off)` is used to transmit an RC code, where
     - `code` matches one of the input schemes, e.g., `'ff0f00fffff0'` or `'a3'`
     - `type` is one of {`'binary'`, `'tristate'`, `'dip'`, `'rotary'`,
       `'intertechno'`, `'rev'`} (default: `'binary'`)
     - `off` is `true` to send an `off` code (default: `false`, i.e., switch on)
     
     Some examples:
     - `send('b2', 'rev')` turns on the "B2" power socket of a system using REV
       naming
     - `send('b2', 'rev', true)` turns *off* the same socket
     - `send('010100010000010101010101')`, `send('ff0f00ffffff', 'tristate')`,
       and `send('0010110000', 'dip')` are all translated to the same transmission

If you have questions or run into problems, please file an issue. :)

[wpi-setup]:  http://wiringpi.com/reference/setup/
[gpio-util]:  http://wiringpi.com/the-gpio-utility/
[pinout]:     http://pi.gadgetoid.com/pinout/gpio
[example-js]: https://github.com/tjanson/PiSwitch/blob/master/example.js
[config-js]:  https://github.com/tjanson/PiSwitch/blob/master/config.js
