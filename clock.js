"use strict";
// Simple clock, update every 1 second

var sseg=require('./sixteenSegments.js');

var Gpio = require('onoff').Gpio,
  sclk = new Gpio(6, 'out'),
  ser = new Gpio(1, 'out'),
  rclk = new Gpio(0, 'out');

sseg.setup(ser, sclk, rclk);

function displayTime() {
  var now=new Date();
  var hours=now.getHours();
  var minutes=now.getMinutes();
  var seconds=now.getSeconds();

  var hourString=(hours<10)?" "+hours:""+hours;
  var minuteString=(minutes<10)?"0"+minutes:""+minutes;
  var secondString=(seconds<10)?"0"+seconds:""+seconds;

  sseg.displayString(hourString+minuteString+secondString);
}



setInterval(displayTime, 1000);
