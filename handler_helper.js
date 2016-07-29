var lodash = require('lodash'),
    Promise = require("bluebird");

var DataHelper = require('./data_helper');
var helper = new DataHelper();

function HandlerHelper() {};

HandlerHelper.prototype.handleRequest = function(message, request) {

    if (message.originalRequest.message) {
        return message.text;
    } else if (message.originalRequest.inline_query) {
        var inlines = helper.getInlineSuggestions(message.text, message.originalRequest);
        return new Promise(function(resolve, reject) {
            resolve(inlines);
        });
    }
};

module.exports = HandlerHelper;