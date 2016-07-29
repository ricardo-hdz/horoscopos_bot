var botBuilder = require('claudia-bot-builder'),
    lodash = require('lodash');

var parseJson = require('parse-json');
var HandlerHelper = require('./handler_helper');


// @HoroscoposBot a
module.exports = botBuilder(function (message, request) {
    // @see for object structure https://core.telegram.org/bots/api#update
    var helper = new HandlerHelper();
    return helper.handleRequest(message, request);
    // var result = {
    //     'type': 'article',
    //     'id': '123',
    //     'title': 'Acuario',
    //     'input_message_content': {
    //         'message_text': '<b>Message text: </b>: ' + message.text,
    //         'parse_mode': 'HTML'
    //     },
    //     'url': 'www.google.com',
    //     'description': 'Description text'
    // };

    // if (message.originalRequest.message) {
    //     return 'message';
    // } else if (message.originalRequest.inline_query) {
    //     return new Promise(function(resolve, reject) {
    //         resolve(DataHelper.getInlineSuggestions(message.text, message.originalRequest));
    //     });
    //     // return 'message inline ' + message.text;
    //     // return [result];
    // }
});