"use strict";

const config = require('../../utils/config').getConfig();
const logger = require('../../utils/logger');
const crypto = require('crypto');
const requestAjax = require('request');

module.exports = function(request, callback) {

    let ip = request.headers['x-forwarded-for'] ||
        request.connection.remoteAddress ||
        request.socket.remoteAddress ||
        request.connection.socket.remoteAddress;

    if (config.stun_turn_server_api) {
        requestAjax.post(config.stun_turn_server_api.url, {
            json: true,
            body: {
                ident: config.stun_turn_server_api.ident,
                secret: config.stun_turn_server_api.secret,
                domain: config.stun_turn_server_api.domain,
                application: config.stun_turn_server_api.application,
                room: config.stun_turn_server_api.room,
                secure: config.stun_turn_server_api.secure
            }
        }, function(err, res, body) {
            if (!err && res.statusCode === 200) {
                let result = {
                    template: 'json',
                    httpCode: 200,
                    logMessage: JSON.stringify(body.d),
                    values: {
                        title: '',
                        object: body.d
                    }
                };
                
                logger.printLog('debug', `Sent TURN servers to client with ip ${ip}`);
                logger.printLog('debug', `Sent STUN servers to client with ip ${ip}`);
                callback(false, result);
            }
            else {
                callback(true, `Unable to get stun/turn servers: ${err}`);
            }
        });
    }
    else {
        let peerConnectionConfig = {
            iceServers: []
        };

        peerConnectionConfig.iceServers = config.stun_servers;

        let credentials = [];
        config.turn_servers.forEach(function(server) {
            let hmac = crypto.createHmac('sha1', server.secret);
            let username = Math.floor(new Date().getTime() / 1000) + (server.expiry || 86400) + "";
            hmac.update(username);
            credentials.push({
                username: username,
                credential: hmac.digest('base64'),
                url: server.url
            });
        });

        credentials.forEach(function(credential) {
            peerConnectionConfig.iceServers.push(credential);
        });

        let result = {
            template: 'json',
            httpCode: 200,
            logMessage: JSON.stringify(peerConnectionConfig),
            values: {
                object: peerConnectionConfig
            }
        };

        logger.printLog('debug', `Sent TURN servers to client with ip ${ip}`);
        logger.printLog('debug', `Sent STUN servers to client with ip ${ip}`);
        callback(false, result);
    }
};