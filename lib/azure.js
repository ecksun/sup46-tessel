'use strict';

var http = require('http');

var Azure = module.exports = function Azure() {};

Azure.prototype.getPosition = function getPosition(cb) {
    http.get('https://checkhealth.azurewebsites.net/flag', function (res) {
        // console.log('http get compelted');
        res.on('data', function (data) {
            var jsonData = JSON.parse(data);
            // console.log('# received', jsonData);
            cb(null, jsonData.position);
        });
        res.on('end', function () {
            // console.log('res end');
            // setImmediate(start);
        });
    }).on('error', function (err) {
        console.log('not ok -', err.message, 'error event');
        cb(err);
        // setImmediate(start);
    });
};

Azure.prototype.buttonPress = function buttonPress() {
    //debugger;
    var options = {
        hostname: 'checkhealth.azurewebsites.net',
        path: '/reset',
        port: 80,
        //This is what changes the request to a POST request
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    };

    var callback = function(response) {
        console.log('cb post');
        var str = '';
        response.on('data', function (chunk) {
            str += chunk;
        });

        response.on('end', function () {
            console.log('end');
            console.log(str);
        });
    };

    var req = http.request(options, callback);
    console.log('woop');

    req.on(
          'error',
          function(e) {
            console.log("Problem with request: %s", e)
          }
        )

    //This is the data we are posting, it needs to be a string or a buffer
    req.write(JSON.stringify({
        position: 1
    }));
    req.end();
};
