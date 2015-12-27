"use strict";

const fs = require('fs');

function showLicense() {
    try {
        let license = fs.readFileSync('LICENSE', 'utf8');
        console.log(license);
    }
    catch (e) {
        console.log(`Error reading the license file (${e})`);
    }
}

module.exports = {
    command: 'license',
    description: 'Shows the license',
    action: showLicense
};