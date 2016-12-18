# orange_pi_gpio
Simple GPIO with an Orange Pi Zero

It was surprisingly hard to find out how to change the GPIO pins on the Orange Pi Zero. However, once you know, it's surprisingly simple. And a working example goes a long way toward this explanation.

## setgpio.sh

Usage: setgpio.sh -i pin1,pin2,... -o pin3,pin4,...

where pin1,pin2,... are input pins and
pin3,pin4,... are output pins.

## trigger_in16.js

### Hardware Setup

* Connect PA7 (pin 12 of the CON4 26 pin connector) to a LED (via resistor to 3.3V)
* Connect PA6 (pin 7 of CON4) to PA15 (pin 19 of CON4)

### Software

To run (after cloning this repository):
```
npm install
sudo ./setgpio.sh -i 16 -o 6,7
node trigger_in16.js
```

and in another terminal do:
```
echo 1 >/sys/class/gpio/gpio16/value
echo 0 >/sys/class/gpio/gpio16/value
```

and you should see a matching change on the LED on PA7.

