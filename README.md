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

Installation & Usage
--------------------

### Hardware

Attach your 433 MHz transmitter to VCC, GND, and a pin of your liking.

### Software

1. Run `npm install` in the project directory to install PiSwitch’s dependencies.

2. Choose between running as PiSwitch with `root` privileges or using the
   WiringPi [`gpio`](http://wiringpi.com/the-gpio-utility/) utility to `export`
   the GPIO pins, making them accessible to non-root users.

   The latter is recommended and the default so please have a look at the `gpio`
   util’s documentation. The relevant command is `gpio export <pin> out` (BCM pin numbering).
   (Also try `gpio readall`: a very handy reference.)
   
   If you would rather run as root, pass `mode: 'gpio'` during setup.

3. Now take a look at `example.js`. Note:
   * `setup()` must be called to initialize WiringPi. You'll probably want to
     to pass key–value option pairs (e.g., `{ pulseLength: 350, pin: 27 }`) that
     match your setup. See `config.js`.

   * then `send(code, type, off)` is used to transmit an RC code, where
     - `code` matches one of the input schemes, e.g., `'ff0f00fffff0'` or `'a3'`
     - `type` is one of {`'binary'`, `'tristate'`, `'dip'`, `'rotary'`,
       `'intertechno'`, `'rev'`} (default: `'binary'`)
     - `off` is `true` to send an `off` code (default: `false`, i.e., switch on)

If you have questions or run into problems, please file an issue. :)
