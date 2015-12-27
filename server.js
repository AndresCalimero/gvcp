//  GVCP - GNU Video Conferencing Platform
//  Copyright (C) 2015  Andrés Calimero
//
//  This program is free software: you can redistribute it and/or modify
//  it under the terms of the GNU General Public License as published by
//  the Free Software Foundation, either version 3 of the License, or
//  (at your option) any later version.
//
//  This program is distributed in the hope that it will be useful,
//  but WITHOUT ANY WARRANTY; without even the implied warranty of
//  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//  GNU General Public License for more details.
//
//  You should have received a copy of the GNU General Public License
//  along with this program.  If not, see <http://www.gnu.org/licenses/>.

"use strict";

const cli = require('./utils/commands/cli');
cli.initCli();
const config = require('./utils/config');
const logger = require('./utils/logger');
const router = require('./controllers/router');
const signaller = require('./signaller');
const fs = require('fs');

let server, ip = config.getConfigValue('ip'), port;

if (config.getConfigValue('secure')) {
    let options = {
        key: fs.readFileSync('keys/ssl-key.pem'),
        cert: fs.readFileSync('keys/ssl-cert.pem')
    };
    require('./utils/https-redirect').initRedirect();
    server = require('https').createServer(options);
    port = config.getConfigValue('ssl_port');
} else {
    server = require('http').createServer();
    port = config.getConfigValue('port');
    logger.printLog('warning', 'Using unsecure server, consider using HTTPS');
}

server.listen(port, ip);
signaller(server);
server.on('request', router);
server.on('listening', onListening);
server.on('error', onError);

function onListening() {
    logger.printLog('log', `${config.getConfigValue('secure') ? 'HTTPS' : 'HTTP'} server listening on ${ip}:${port}`);
}

function onError(err) {
    if (err.code === 'EADDRINUSE') {
        logger.printLog('error', `Port ${port} already in use`);
    }
    else {
        logger.printLog('error', `Unable to use the port ${port}`);
    }
    cli.clearLine();
    process.exit(0);
}
