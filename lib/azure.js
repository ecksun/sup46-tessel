'use strict';

var assert = require('assert');

var restify = require('restify');

var Azure = module.exports = function Azure() {
    this.client = restify.createJsonClient({
        url: 'https://checkhealth.azurewebsites.net/'
    });
};

Azure.prototype.getPosition = function getPosition(cb) {
    this.client.get('/flag', function (err, req, res, obj) {
        if (err) {
            return cb(err);
        }
        if (!obj.position) {
            cb(new Error('Did not get a position'));
        }

        cb(null, obj.position);
    });
};
