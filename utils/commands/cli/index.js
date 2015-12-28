"use strict";

const config = require('../../config');
const readline = require('readline');
const glob = require('glob');
const modules = glob.sync('utils/commands/_*');

let commands = [];

modules.forEach(function(module) {
    let moduleName = module.split('/').reverse()[0].substring(1);
    commands.push(require(`../_${moduleName}`));
});

let rl = 0;

function initCli() {
    if (rl === 0) {
        console.log("GVCP  Copyright (C) 2015  Andrés Calimero");
        console.log("This program comes with ABSOLUTELY NO WARRANTY; for details type 'license'.");
        console.log("This is free software, and you are welcome to redistribute it under certain conditions.");
        console.log('');
        rl = readline.createInterface(process.stdin, process.stdout);
        rl.setPrompt('> ');

        rl.on('line', function(line) {
            line = line.trim();
            switch (line) {
                case 'help':
                    help();
                    break;
                case 'exit':
                    closeServer();
                    break;
                case '':
                    break;
                default:
                    let i;
                    for (i = 0; i < commands.length; i++) {
                        if (commands[i].command == line) {
                            commands[i].action();
                            break;
                        }
                    }
                    if (i == commands.length) {
                        console.log(`Unknown command '${line}'`);
                    }
            }
            rl.prompt();

        }).on('close', function() {
            closeServer();
        });
    }
    else {
        throw new Error("cli already started");
    }
}

function prompt() {
    if (rl !== 0) {
        rl.prompt();
    }
    else {
        throw new Error("cli not started yet");
    }
}

function clearLine() {
    if (rl !== 0) {
        readline.clearLine(process.stdin, -1);
        readline.moveCursor(process.stdin, -2, 0);
    }
    else {
        throw new Error("cli not started yet");
    }
}

function closeServer() {
    console.log('Closing server...');
    process.exit(0);
}

function help() {
    console.log('Available commands:');
    console.log('   help - Displays this information');
    console.log('   exit - Closes the server');
    commands.forEach(function(command){
        console.log(`   ${command.command} - ${command.description}`);
    });
}

if (config.getConfigValue('cli')) {
    module.exports = {
        initCli: initCli,
        prompt: prompt,
        clearLine: clearLine
    };
}
else {
    module.exports = {
        initCli: function() {},
        prompt: function() {},
        clearLine: function() {}
    };
}