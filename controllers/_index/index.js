"use strict";

const url = require('url');

module.exports = function(request, callback) {
    let result;
    let query = url.parse(request.url, true).query;

    if (typeof query.room === 'undefined' || query.room.length == 0) {
        result = {
            template: 'index',
            httpCode: 200, // Optional, default 200
            logMessage: 'OK', // Optional, default OK
            values: {
                title: 'Main'
            }
        };
    }
    else {
        result = {
            template: 'room',
            httpCode: 200,
            logMessage: 'OK',
            values: {
                title: query.room
            }
        };
    }
    
    callback(false, result);
};