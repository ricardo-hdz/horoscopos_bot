var _ = require('lodash');
var DataHelper = require('./data_helper');

function HandlerHelper() {};

HandlerHelper.prototype.handleRequest = function(message, request) {
    var helper = new DataHelper();

    // This bot does not handle message requests, only inline queies
    // if (message.originalRequest.message) {
    //     return 'Message: ' + message.text + ' JSON request: ' + JSON.stringify(message.originalRequest);
    // } else
    if (message.originalRequest.inline_query) {
        return helper.getInlineHoroscope(message.text, message.originalRequest);
    }
};

module.exports = HandlerHelper;