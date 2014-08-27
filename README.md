PiSwitch
========

Use your Raspberry Pi to control 433 MHz RC power sockets. Inspired by RC-Switch for Arduino.

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
* `setup()` must be called to initialize WiringPi. (*Todo: explain options.*)
* `send(*String* code, *String* type, *bool* off)` where
     - `code` matches one of the input schemes, e.g., `ff0f00fffff0` or `a3`
     - `type` is one of {`binary`, `tristate`, `dip`, `rotary`, `intertechno`, `rev`}
     - `off` is `true` to send an `off` code (if omitted or `false`, an `on` code is sent)


Todo
----

* better documentation of WiringPi setup()/non-root usage
