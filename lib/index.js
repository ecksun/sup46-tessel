'use strict';

var assert = require('assert');

var tessel = require('tessel');
var servolib = require('servo-pca9685');

var Azure = require('./azure');
var azure = new Azure();

var servo = servolib.use(tessel.port.A);

console.log('starting');
servo.on('ready', function () {
  servo.configure(1, 0.05, 0.12, function () {
      setInterval(function setPos() {
          azure.getPosition(function(err, pos) {
              console.log('Setting pos', pos);
              assert.ifError(err);
              servo.move(1, pos);
          });
      }, 500);
      (function read() {
          servo.read(1, function(err, reading) {
              setTimeout(read, 200);
              if (err) {
                  console.log('Failed to read');
                  return;
              }
              console.log('Position:', reading);
          });
      })();
  });
});

tessel.button.on('release', function(time) {
    console.log('Resetting button');
    azure.buttonPress();
});
