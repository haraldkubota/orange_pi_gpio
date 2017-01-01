"use strict";

// Argument is a number. Send this to the first LED character


var Gpio = require('onoff').Gpio,
  sclk = new Gpio(6, 'out'),
  ser = new Gpio(1, 'out'),
  rclk = new Gpio(0, 'out');

// data is an array of 16 bit data elements to shift data out
function sendBits(data, n) {
  var i, j;

  rclk.writeSync(0);
  for (i=0; i<n; ++i) {
    for (j=0; j<16; ++j) {
      let a=((data[i] & (1<<j)) ? 0 : 1);
      ser.writeSync(a);
      sclk.writeSync(1);
      sclk.writeSync(0);
    }
  }
  rclk.writeSync(1);
  rclk.writeSync(0);
}

function displayBit(n) {
  var data=[n];

  return function() {
    sendBits(data, 1);
  }
}


//var f=displayChars();
var n=parseInt(process.argv[2]);
console.log("Sending "+n);
var f=displayBit(n);
f();
//setInterval(f, 1000);



