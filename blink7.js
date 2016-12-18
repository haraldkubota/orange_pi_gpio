var Gpio = require('onoff').Gpio,
  led = new Gpio(7, 'out');

function blinkled7() {
  var state=false;
  return function () {
    console.log(state);
    if (state) led.writeSync(0)
    else led.writeSync(1);
    state = ! state;
    }
}

f=blinkled7();
setInterval(f, 1000);

