# Simple GPIO with an Orange Pi Zero


It was surprisingly hard to find out how to change the GPIO pins on the Orange Pi Zero. However, once you know, it's surprisingly simple. And a working example goes a long way toward this explanation.

## trigger_in16.js

### Hardware Setup

* Connect PA7 (pin 12 of the CON4 26 pin connector) to a LED (via resistor to 3.3V)
* Connect PA6 (pin 7 of CON4) to PA15 (pin 19 of CON4)

### Software

You'll want Armbian from https://www.armbian.com/orange-pi-zero/
I am using 3.4.113-sun8i kernel.

After cloning this repository:
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

## setgpio.sh

I created this small tool to set resp. reset GPIO pins.

Usage: `setgpio.sh -i pin1,pin2,... -o pin3,pin4,...`

where `pin1,pin2,...` are input pins and
`pin3,pin4,...` are output pinsi, both comma separated.

## GPIO Pins

Here the list of GPIO pins which I could confirm working (PA10, PA11 and PA12 did not work as they seem to be used)

```
CON4	Label      SOC	Linux GPIO
 1    Vcc3V3-EXT		
 3    TWI0-SDA   PA12	 12
 5    TWI0-SCK   PA11	 11
 7    PWM1       PA6    6
 9    GND		
11    UART2_RX   PA1    1
13    UART2_TX   PA0	  0
15    UART2_CTS  PA3	  3
17    VCC3V3-EXT		
19    SPI1_MOSI  PA15	 15
21    SPI1_MISO  PA16	 16
23    SPI1_CLK   PA14	 14
25    GND		
 2    DCIN-5V		
 4    DCIN-5V		
 6    GND		
 8  	UART1_TX   PG6	198
10	  UART1_RX   PG7	199
12    PA7        PA7    7
14    GND		
16    TWI1-SDA   PA12	
18    TWI1-SCK   PA11	
20    GND		
22    UART2_RTS  PA2    2
24    SPI1_CS    PA13  13
26    PA10       PA10?	
```
