"use strict";

const config = require('../config');
const cli = require('../commands/cli');

module.exports = {
    printLog: function printLog(type, text) {
        cli.clearLine();
        if (type == 'error') {
            console.error(`[${new Date().toUTCString()}] >> [ERROR] ${text}`);
        }
        else if (type == 'warning') {
            console.log(`[${new Date().toUTCString()}] >> [WARNING] ${text}`);
        }
        else if (type == 'log') {
            console.log(`[${new Date().toUTCString()}] >> [LOG] ${text}`);
        }
        else if (type == 'debug') {
            if (config.getConfigValue('debug')) {
                console.log(`[${new Date().toUTCString()}] >> [DEBUG] ${text}`);
            }
        }
        else {
            throw new Error("invalid debug level '" + type + "'");
        }
        cli.prompt();
    }
};
