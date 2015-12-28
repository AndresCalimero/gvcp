"use strict";

const socketIO = require('socket.io');
const uuid = require('node-uuid');
const logger = require('../utils/logger');
const config = require('../utils/config').getConfig();

module.exports = function(server) {
    const io = socketIO.listen(server, {
        log: false
    });

    io.sockets.on('connection', function(client) {
        client.resources = {
            screen: false,
            video: true,
            audio: false
        };

        logger.printLog('debug', `Client ${client.id} connected ${JSON.stringify(client.resources)}`);

        client.on('message', function(details) {
            if (!details) return;

            let otherClient = io.sockets.sockets[details.to];
            if (!otherClient) return;

            details.from = client.id;
            otherClient.emit('message', details);
        });

        client.on('shareScreen', function() {
            client.resources.screen = true;
            logger.printLog('debug', `Client ${client.id} enable screen share`);
        });

        client.on('unshareScreen', function(type) {
            client.resources.screen = false;
            removeFeed('screen');
            logger.printLog('debug', `Client ${client.id} disable screen share`);
        });

        client.on('join', join);

        function removeFeed(type) {
            if (client.room) {
                io.sockets.in(client.room).emit('remove', {
                    id: client.id,
                    type: type
                });
                if (!type) {
                    logger.printLog('debug', `Client ${client.id} leave room '${client.room}'`);
                    client.leave(client.room);
                    client.room = undefined;
                }
            }
        }

        function join(name, cb) {
            if (typeof name !== 'string') return;

            if (config.room_capacity > 0 && clientsInRoom(name) >= config.room_capacity) {
                safeCb(cb)('full');
                logger.printLog('debug', `Client ${client.id} tried to join room '${name}' but it is full`);
                return;
            }

            removeFeed();
            safeCb(cb)(null, describeRoom(name));
            client.join(name);
            client.room = name;
            logger.printLog('debug', `Client ${client.id} joined room '${name}'`);
        }

        client.on('disconnect', function() {
            logger.printLog('debug', `Client ${client.id} disconnected`);
            removeFeed();
        });

        client.on('leave', function() {
            logger.printLog('debug', `Client ${client.id} leave`);
            removeFeed();
        });

        client.on('create', function(name, cb) {
            if (arguments.length == 2) {
                cb = (typeof cb == 'function') ? cb : function() {};
                name = name || uuid();
            }
            else {
                cb = name;
                name = uuid();
            }

            if (io.sockets.clients(name).length) {
                safeCb(cb)('taken');
                logger.printLog('debug', `Client ${client.id} tried to create a new room but it already exists (${name})`);
            }
            else {
                join(name);
                safeCb(cb)(null, name);
                logger.printLog('debug', `Client ${client.id} create a new room (${name})`);
            }
        });

        client.on('trace', function(data) {
            logger.printLog('log', JSON.stringify(
                [data.type, data.session, data.prefix, data.peer, data.time, data.value]
            ));
        });
    });


    function describeRoom(name) {
        let clients = io.sockets.clients(name);
        let result = {
            clients: {}
        };
        clients.forEach(function(client) {
            result.clients[client.id] = client.resources;
        });
        return result;
    }

    function clientsInRoom(name) {
        return io.sockets.clients(name).length;
    }

};

function safeCb(cb) {
    if (typeof cb === 'function') {
        return cb;
    }
    else {
        return function() {};
    }
}