"use strict";

const fs = require('fs');
const logger = require('../../utils/logger');
const Handlebars = require('handlebars');
const glob = require('glob');
const templates = glob.sync('views/*.tmpl');

const compiledTemplates = {};

templates.forEach(function(template) {
    let name = template.split('/').reverse()[0].split('.')[0];
    compiledTemplates[name] = Handlebars.compile(fs.readFileSync(template, 'utf8'));
    logger.printLog('debug', `Template '${template}' compiled`);
});

Handlebars.registerPartial('_header', compiledTemplates['_header']);
Handlebars.registerPartial('_footer', compiledTemplates['_footer']);

Handlebars.registerHelper('equals', function(a, b, options) {
    if (a == b) {
        return options.fn(this);
    }
    else {
        return options.inverse(this);
    }
});

Handlebars.registerHelper('json', function(context) {
    return JSON.stringify(context);
});

module.exports = function(name, values) {
    let template = compiledTemplates[name];
    if (typeof template === 'undefined') {
        throw new Error("template '" + name + "' does not exists");
    }

    return template(values);
};