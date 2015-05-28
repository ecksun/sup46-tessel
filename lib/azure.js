'use strict';

var http = require('http');

var Azure = module.exports = function Azure() {};

Azure.prototype.getPosition = function getPosition(cb) {
    http.get('https://checkhealth.azurewebsites.net/flag', function (res) {
        console.log('http get compelted');
        res.on('data', function (data) {
            var jsonData = JSON.parse(data);
            console.log('# received', jsonData);
            cb(null, jsonData);
        });
        res.on('end', function () {
            console.log('res end');
            // setImmediate(start);
        });
    }).on('error', function (err) {
        console.log('not ok -', err.message, 'error event');
        cb(err);
        // setImmediate(start);
    });
};
