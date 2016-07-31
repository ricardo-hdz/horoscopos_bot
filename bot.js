var botBuilder = require('claudia-bot-builder'),
    _ = require('lodash');

var parseJson = require('parse-json');
var HandlerHelper = require('./handler_helper');

// @HoroscoposBot a

module.exports = botBuilder(function (message, request) {
    // @see for object structure https://core.telegram.org/bots/api#update
    var helper = new HandlerHelper();
    return helper.handleRequest(message, request);
});