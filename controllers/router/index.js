"use strict";

const nodeStatic = require('node-static');
const url = require('url');
const config = require('../../utils/config');
const logger = require('../../utils/logger');
const render = require('../../views/render');
const controller = require('../controller');

const fileServer = new nodeStatic.Server(config.getConfigValue('public_folder'), {
    cache: config.getConfigValue('cache_max_age'),
    serverInfo: config.getConfigValue('server_info')
});

function onRequest(request, response) {
    if (request.url.startsWith('/socket.io')) return;
    
    let url_parts = url.parse(request.url, true);
    
    if (url_parts.pathname == '/') {
        request.url = '/index' + url_parts.search;
    }

    controller.serve(request, response, function(err, message) {
        if (err) {
            fileServer.serve(request, response, function(err, result) {
                if (err) {
                    let errorPage = render(config.getConfigValue('error_template').split('.')[0], {
                        code: err.status,
                        message: err.message,
                        title: err.status
                    });

                    let resHeaders = err.headers;
                    resHeaders['Content-Type'] = 'text/html';
                    resHeaders['Content-Length'] = Buffer.byteLength(errorPage, 'utf8');
                    resHeaders['server'] = config.getConfigValue('server_info');

                    response.writeHead(err.status, resHeaders);
                    response.write(errorPage, 'utf8');
                    response.end();
                    
                    logger.printLog('debug', `Error serving ${request.url} - ${err.message}`);
                }
                else {
                    logger.printLog('debug', `Response sent ${request.url} > ${result.message}`);
                }
            });
        }
        else {
            logger.printLog('debug', `Response sent ${request.url} > ${message}`);
        }
    });
}

module.exports = onRequest;