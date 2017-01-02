"use strict";
var sseg=require('./sixteenSegments.js');

var Gpio = require('onoff').Gpio,

  sclk = new Gpio(6, 'out'),
  ser = new Gpio(1, 'out'),
  rclk = new Gpio(0, 'out');

sseg.setup(ser, sclk, rclk);

var f=sseg.circle(0x00110055, 1);
setInterval(f, 50);

