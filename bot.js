var botBuilder = require('claudia-bot-builder'),
    lodash = require('lodash'),
    Promise = require("bluebird");

var DataHelper = require('./data_helper');
var parseJson = require('parse-json');

module.exports = botBuilder(function (message, request) {
    // @see for object structure https://core.telegram.org/bots/api#update
    var result = {
        'type': 'article',
        'id': '123',
        'title': 'Acuario',
        'input_message_content': {
            'message_text': '<b>Acuario</b>',
            'parse_mode': 'HTML'
        },
        'url': 'www.google.com',
        'description': 'Description text'
    };

    if (message.originalRequest.message) {
        return 'message';
    } else if (message.originalRequest.inline_query) {
        return 'message inline ' + message.text;
        // return [result];
    }
});