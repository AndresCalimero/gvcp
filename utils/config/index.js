"use strict";

const fs = require('fs');

function setDefaults(configValue) {
    let result = configValue;
    if (typeof configValue === 'undefined') {
        for (let i = 1; i < arguments.length; i++) {
            if (typeof arguments[i] != 'undefined') {
                result = arguments[i];
                break;
            }
        }
    }
    return result;
}

let config;

if (fs.existsSync('config/config.json')) {
    config = JSON.parse(fs.readFileSync('config/config.json', 'utf8'));
} else {
    config = {};
}

config.debug = setDefaults(config.debug, false);
config.url = setDefaults(config.url, 'localhost');
config.secure = setDefaults(config.secure, true);
config.cli = setDefaults(config.cli, true);
config.title = setDefaults(config.title, 'GVCP');
config.ip = setDefaults(config.ip, process.env.IP, '0.0.0.0');
config.port = setDefaults(config.port, process.env.PORT, 80);
config.ssl_port = setDefaults(config.ssl_port, 443);
config.public_folder = setDefaults(config.public_folder, './public');
config.error_template = setDefaults(config.error_template, 'error.tmpl');
config.cache_max_age = setDefaults(config.cache_max_age, 7 * 24 * 60 * 60);
config.server_info = setDefaults(config.server_info, 'GVCP-Server');
config.stun_turn_server_api = setDefaults(config.stun_turn_server_api, false);
config.stun_servers = setDefaults(config.stun_servers, []);
config.turn_servers = setDefaults(config.turn_servers, []);
config.room_capacity = setDefaults(config.room_capacity, 4); // -1 for unlimited capacity

module.exports = {
    getConfig: function() {
        return config;
    },

    getConfigValue: function(configName) {
        let value = config[configName];

        if (typeof value === 'undefined') {
            throw new Error("config value '" + configName + "' does not exists");
        }

        return value;
    }
};
