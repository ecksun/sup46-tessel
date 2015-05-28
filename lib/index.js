'use strict';

var assert = require('assert');

var tessel = require('tessel');
var servolib = require('servo-pca9685');

var Azure = require('./azure');

var azure = new Azure();

var servo = servolib.use(tessel.port.A);

var poss = [0, 0.1, 0.5, 0.7, 1];
var i = 0;

console.log('starting');
servo.on('ready', function () {
  servo.configure(1, 0.05, 0.12, function () {
      setInterval(function setPos() {
          azure.getPosition(function(err, pos) {
              // var pos = poss[i];
              console.log('Setting pos', pos);
              assert.ifError(err);
              servo.move(1, pos);
              i = (i + 1) % 5;
          });
      }, 1000);
  });
});
