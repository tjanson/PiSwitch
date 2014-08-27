PiSwitch
========

Use your Raspberry Pi to control 433 MHz RC power sockets.
Inspired by RC-Switch for Arduino.

PiSwitch is also available as an
[`npm` package](https://www.npmjs.org/package/piswitch).

I'm not able to test all code types, so if you encounter a problem, let me
know. Issues and PRs welcome.

Features
--------

* compatibility with RC-Switch, i.e., supports the same devices
* code input in binary, tristate, and the following schemes:
     - 10 DIP switches (`/^[01]{10}$/`)
     - two (often rotary) switches with 4 positions (`/^[1-4]{2}$/`)
     - Intertechno (`/^[a-p][1-4]{2}$/`)
     - REV (`/^[a-d][123]$/`)
* easily extendable translation procedure with JSON dictionary

Usage
-----

### Hardware

Attach your 433 MHz transmitter to VCC, GND, and a pin of your liking.

### Software

PiSwitch can be used as a non-root user by exporting the GPIO pin using
the WiringPi [`gpio`](http://wiringpi.com/the-gpio-utility/) util; see
their website for details. The relevant command is `gpio export <pin> out`
(BCM numbering). (Also try `gpio readall`: a very handy reference.)
If you would rather run as root, pass `mode: 'gpio'` during setup.

* `setup()` must be called to initialize WiringPi. You'll probably want to
  to pass key–value option pairs (e.g., `{ pulseLength: 350, pin: 27 }`) that
  match your setup. See `config.js`.

* `send(code, type, off)` where
     - `code` matches one of the input schemes, e.g., `'ff0f00fffff0'` or `'a3'`
     - `type` is one of {`'binary'`, `'tristate'`, `'dip'`, `'rotary'`,
       `'intertechno'`, `'rev'`} (default: `'binary'`)
     - `off` is `true` to send an `off` code (default: `false`, i.e., switch on)
