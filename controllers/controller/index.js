"use strict";

const url = require('url');
const config = require('../../utils/config');
const render = require('../../views/render');
const logger = require('../../utils/logger');
const glob = require('glob');
const modules = glob.sync('controllers/_*');

let controllers = {};

modules.forEach(function(module) {
    let moduleName = module.split('/').reverse()[0].substring(1);
    controllers[moduleName] = require(`../_${moduleName}`);
    logger.printLog('debug', `Controller '${module}' registered`);
});

function servePage(result, response, callback) {
    let resHeaders = {}, page = render(result.template, result.values);
    
    resHeaders['Content-Type'] = 'text/html';
    resHeaders['Content-Length'] = Buffer.byteLength(page, 'utf8');
    resHeaders['server'] = config.getConfigValue('server_info');

    response.writeHead(result.httpCode || 200, resHeaders);
    response.write(page, 'utf8');
    response.end();

    callback(false, result.logMessage || 'OK');
}

module.exports = {
    serve: function serve(request, response, callback) {
        let url_parts = url.parse(request.url, true);
        
        let controller = controllers[url_parts.pathname.substring(1)];

        if (typeof controller === 'undefined') {
            callback('not a dynamic page');
        } else {
            controller(request, function(err, result) {
                if (!err) {
                    servePage(result, response, callback);
                } else {
                    logger.printLog('error', err);
                }
            });
        }
    }
};