"use strict";

const cli = require('../commands/cli');
const config = require('../config');
const logger = require('../logger');
const http = require('http');

let httpServer = 0;

function initRedirect() {
    if (httpServer == 0) {
        httpServer = http.createServer();
        httpServer.listen(config.getConfigValue('port'), config.getConfigValue('ip'));
        httpServer.on('request', redirectToHttps);
        httpServer.on('listening', onListening);
        httpServer.on('error', onError);
    }
    else {
        throw new Error("https-redirect already started");
    }

}

function redirectToHttps(req, res) {
    let host = req.headers.host;
    let port = config.getConfigValue('ssl_port');
    host = host.split(':')[0] + ':' + port;

    res.writeHead(301, {
        'Content-Type': 'text/plain',
        'Location': 'https://' + host + req.url
    });
    res.end('Redirecting to SSL');

    logger.printLog('debug', `Redirecting (http) ${req.headers.host}${req.url} to (https) ${host}${req.url}`);
}

function onListening() {
    logger.printLog('log', `HTTP server listening on ${config.getConfigValue('ip')}:${config.getConfigValue('port')}`);
}

function onError(err) {
    if (err.code === 'EADDRINUSE') {
        logger.printLog('error', `Port ${config.getConfigValue('port')} already in use`);
    }
    else {
        logger.printLog('error', `Unable to use the port ${config.getConfigValue('port')}`);
    }
    cli.clearLine();
    process.exit(0);
}

module.exports = {
    initRedirect: initRedirect
};