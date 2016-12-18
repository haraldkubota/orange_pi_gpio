var Gpio = require('onoff').Gpio,
  led = new Gpio(7, 'out'),
  button = new Gpio(16, 'in', 'both');

button.watch(function (err, value) {
  if (err) {
    throw err;
  }
  console.log("Changing "+value);
  led.writeSync(value);
});

process.on('SIGINT', function () {
  console.log("leaving...");
  led.unexport();
  button.unexport();
});

