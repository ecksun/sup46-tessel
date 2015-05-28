var http = require('http');
var servolib = require('servo-pca9685');
var tessel = require('tessel');


var count = 1;
var servo = servolib.use(tessel.port['A']);

var led1 = tessel.led[0].output(1);
var led2 = tessel.led[1].output(0);

var cycled = true
var position = 0
var on = function() {
   if (!cycled) {
     cycled = true
   }
}

var off = function () {
  if (cycled) {
    cycled = false
  }
}

servo.on('ready', function () {
  servo.configure(1, 0.05, 0.12, function start () {
    console.log('http request #' + (count++))
    http.get("https://checkhealth.azurewebsites.net/flag", function (res) {
      console.log('# statusCode', res.statusCode)

      setInterval(function () {
        console.log('Position (in range 0-1):', position);
        //  Set servo #1 to position pos.
        if (!cycled) {
          console.log("cycling")
          servo.move(servo1, position);
          position += 0.1;
          // Increment by 10% (~18 deg for a normal servo)
          if (position > 1) {
            position = 0; // Reset servo position
          }
        }
      }, 500);

      var bufs = [];
      res.on('data', function (data) {
        bufs.push(new Buffer(data));

        var jsonData = JSON.parse(data);
        console.log('# received', jsonData);

        if (data.position === 0.5) {
         on();
       } else {
         off();
       }

        led1.toggle();
      })
      res.on('end', function () {
        console.log('done.');
        setImmediate(start);
      })
    }).on('error', function (e) {
      console.log('not ok -', e.message, 'error event')
      setImmediate(start);
    });
  });
});

//
//
// var servo1 = 1; // We have a servo plugged in at position 1
//
// servo.on('ready', function () {
//   var position = 0;  //  Target position of the servo between 0 (min) and 1 (max).
//
//   //  Set the minimum and maximum duty cycle for servo 1.
//   //  If the servo doesn't move to its full extent or stalls out
//   //  and gets hot, try tuning these values (0.05 and 0.12).
//   //  Moving them towards each other = less movement range
//   //  Moving them apart = more range, more likely to stall and burn out
//   servo.configure(servo1, 0.05, 0.12, function () {
//     setInterval(function () {
//       console.log('Position (in range 0-1):', position);
//       //  Set servo #1 to position pos.
//       servo.move(servo1, position);
//
//       // Increment by 10% (~18 deg for a normal servo)
//       position += 0.1;
//       if (position > 1) {
//         position = 0; // Reset servo position
//       }
//     }, 500); // Every 500 milliseconds
//   });
// });
