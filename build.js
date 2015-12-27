"use strict";

const UglifyJS = require("uglify-js");
const fs = require('fs');
const config = require('./utils/config').getConfig();
const Handlebars = require('handlebars');
const glob = require('glob');
const javaScripts = glob.sync('client/js/*.js');
const templates = glob.sync('client/js_templates/*.tmpl');

javaScripts.forEach(function(javaScript) {
    let name = javaScript.split('/').reverse()[0].replace('.js', '.min.js');
    let result = UglifyJS.minify(javaScript);
    fs.writeFileSync(`${config.public_folder}/js/${name}`, result.code);
});

templates.forEach(function(template) {
    let name = template.split('/').reverse()[0].replace('.js', '.min.js');
    let result = UglifyJS.minify(Handlebars.compile(fs.readFileSync(template, 'utf8'))(config), {
        fromString: true
    });
    fs.writeFileSync(`${config.public_folder}/js/${name.substring(0, name.lastIndexOf('.'))}`, result.code);
});