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
    debugger;
    //The url we want is `www.nodejitsu.com:1337/`
    var options = {
        host: 'https://checkhealth.azurewebsites.net',
        path: '/flag',
        //This is what changes the request to a POST request
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    };

    var callback = function(response) {
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
    //This is the data we are posting, it needs to be a string or a buffer
    req.write(JSON.stringify({
        position: 1
    }));
    req.end();
};
