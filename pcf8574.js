// Simple example using I2C bus (on the 26 pin connector)
// Attached is a PCF8574 which is a super-simple 8 bit bidirectional I/O port
// There is no direction register. Just read and write.
// When connecting LEDs, make sure the LED is connected to Vcc and the PCF8574 is working as a sink.

var i2c = require('i2c-bus'),
  i2c0 = i2c.openSync(0);

var PCF8574_ADDR=0x38;

function outByte(a) {
        i2c0.sendByteSync(PCF8574_ADDR, a);
}

function inByte() {
 return i2c0.receiveByteSync(PCF8574_ADDR);
}

function ledPattern() {
 var output=0;
 return function() {
  outByte(0xFF^(output++));
  }
}

function g() {
 console.log(inByte());
}

f=ledPattern();
setInterval(f, 100);
setInterval(g, 1000);
