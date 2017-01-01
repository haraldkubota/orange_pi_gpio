"use strict";

// Circle 28 bit on a 16 segment LED with 6 characters

var Gpio = require('onoff').Gpio,
  sclk = new Gpio(6, 'out'),
  ser = new Gpio(1, 'out'),
  rclk = new Gpio(0, 'out');

const sixteenSegmentChars=[
  // SPACE ! " # $ % & '
  0x0000, 0x0300, 0x0110, 0x0fd2, 0xddd2, 0x95db, 0x8eb4, 0x0010,
  // ( ) * + , - . /
  0x000c, 0x0021, 0x00ff, 0x00d2, 0x0001, 0x00c0, 0x0004, 0x0009,
  //  0 1 2 3 4 5 6 7
  0xff09, 0x3008, 0xec41, 0xdc48, 0x01d2, 0xcd84, 0x1fc0, 0xc00a,
  // 8 9 : ; < = > ?
  0xffc0, 0xf1c0, 0x8080, 0x8081, 0x0c09, 0xc0c0, 0x0c24, 0xe142,
    // @ A B C D E F G
  0xfe83, 0x3049, 0xfc52, 0xcf00, 0xfc12, 0xcfc0, 0xc3c0, 0xdf40,
  // H I J K L M N O
  0x33c0, 0xcc12, 0x3e00, 0x038c, 0x0f00, 0x3328, 0x3324, 0xff00,
  // P Q R S T U V W
  0xe3c0, 0xff04, 0xe3c4, 0xddc0, 0xc012, 0x3f00, 0x0309, 0x3305,
  // X Y Z [ | ] ^ _
  0x002d, 0x002a, 0xcc09, 0x8b00, 0x0024, 0x7400, 0x0120, 0x0c00,
  // ` a b c d e f g
  0x0020, 0x8e92, 0x0b82, 0x0a80, 0x0e92, 0x0a81, 0x40d2, 0x8992,
  // h i j k l m n o
  0x0382, 0x0a00, 0x0812, 0x001e, 0x0412, 0x12c2, 0x0282, 0x0a82,
  // p q r s t u v w
  0x8390, 0x8192, 0x0280, 0x0444, 0x04d2, 0x0e02, 0x0201, 0x1e02,
  // x y z { | } ~ DEL
  0x002d, 0x3450, 0x0881, 0x4492, 0x0012, 0x8852, 0x0128, 0x00ff
];


// Map 28 bit into 16 bit x 6 characters

var sixChars=[0, 0, 0, 0, 0, 0];
var mapBits=[
 [5,0x4000],
 [5,0x8000],
 [4,0x4000],
 [4,0x8000],
 [3,0x4000],
 [3,0x8000],
 [2,0x4000],
 [2,0x8000],
 [1,0x4000],
 [1,0x8000],
 [0,0x4000],
 [0,0x8000],
 [0,0x0100],
 [0,0x0200],
 [0,0x0800],
 [0,0x0400],
 [1,0x0800],
 [1,0x0400],
 [2,0x0800],
 [2,0x0400],
 [3,0x0800],
 [3,0x0400],
 [4,0x0800],
 [4,0x0400],
 [5,0x0800],
 [5,0x0400],
 [5,0x1000],
 [5,0x2000]
];

// Map 28 bits in bitmask into sixChars[]

function mapBitsToChars(bitmask) {
  for (let i=0; i<28; ++i) {
    if (bitmask & (1<<i)) {
      sixChars[mapBits[i][0]] |= mapBits[i][1];
    } else {
      sixChars[mapBits[i][0]] &= 0xffff^mapBits[i][1];
    }
  }
}




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


function displayChars() {
  var currentChar=0;
  var data=[0];

  return function() {
    data[0]=sixteenSegmentChars[currentChar++];
    sendBits(data, 1);
    if (currentChar==96) currentChar=0;
  }
}

function circle(initBitmask, direction) {
  var bitmask=initBitmask,
      circleDirection = direction;
  return function() {
    mapBitsToChars(bitmask);
    sendBits(sixChars, 6);
    if (circleDirection == 1) {
      if (bitmask & (1<<27)) {
        bitmask = (bitmask << 1) + 1;
      } else {
        bitmask = bitmask << 1;
      }
    } else {
      if (bitmask & 1) {
        bitmask = (bitmask >> 1) | (1<<27);
      } else {
        bitmask = bitmask >> 1;
      }
    }
    bitmask &= 0x0fffffff;
    //console.log("bitmask="+bitmask);
  }
}

    
var f=circle(0x00110011, 0);
f();
setInterval(f, 50);


