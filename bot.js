var botBuilder = require('claudia-bot-builder'),
    lodash = require('lodash');

module.exports = botBuilder(function (request) {
    // @see for object structure https://core.telegram.org/bots/api#update
    return [{
        'type': 'article',
        'id': '123',
        'title': 'Title Custom',
        'input_message_content': {
            'message_text': 'Message Text Placeholder'
        },
        'url': 'www.google.com'
    }];
    // if (_.has(request, 'inline_query')) {
    //     var inlineQuery = request.originalRequest.inline_query;
    //     return {
    //         'inline_query_id': inlineQuery.id,
    //         'results': [{
    //             'type': 'article',
    //             'id': inlineQuery.id,
    //             'title': 'Title Custom',
    //             'input_message_content': {
    //                 'message_text': 'Message Text Placeholder'
    //             },
    //             'url': 'www.google.com'
    //         }]
    //     };
    // } else {
    //     return 'Thanks for sending ' + JSON.stringify(request.originalRequest)  +
    //         '. Your message is very important to us, but ';
    // }

});