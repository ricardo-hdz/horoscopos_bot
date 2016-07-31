'use strict';

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var expect = chai.expect;
var assert = chai.assert;
var DataHelper = require('../data_helper');
var HandlerHelper = require('../handler_helper');
chai.config.includeStack = true;

describe('Data Helper', function() {
    var helper = new DataHelper();
    var sign;

    describe('requestDailyHoroscope', function() {
        context('with a valid sign', function() {
            it('returns correct array of horoscopes', function() {
                sign = 'Acuario';
                var value = helper.requestDailyHoroscope().then(function(obj) {
                  return obj;
                });
                return assert.eventually.isArray(value);
            });

            it('returns correct arra of horoscopes', function() {
                sign = 'Acuario';
                var value = helper.requestHoroscopeBySign(sign).then(function(obj) {
                  return obj;
                });
                return expect(value).to.eventually.have.property('description');
            });

            it('returns correct object with lowercase sign', function() {
                sign = 'acuario';
                var value = helper.requestHoroscopeBySign(sign).then(function(obj) {
                  return obj;
                });
                return expect(value).to.eventually.have.property('description');
            });

            it('returns correct retry message wehn no sign found', function() {
                sign = 'random';
                var retry = 'Por el momento no puedo proporcionarte el horoscopo del dia. Intenta mas tarde.';
                var value = helper.requestHoroscopeBySign(sign).then(function(obj) {
                  return obj;
                });
                return expect(value).to.eventually.deep.eq({'description': retry});
            });
        });
    });

    describe('Utilities ', function() {
        it('returns correct predict signs with one letter', function() {
            var value = helper.predictSigns('a');
            return assert.deepEqual(value,  ['acuario', 'aries']);
        });

        it('returns correct predict signs with two letters', function() {
            var value = helper.predictSigns('ac');
            return assert.deepEqual(value,  ['acuario']);
        });

        it('returns correct predict signs with two letters - multiple signs', function() {
            var value = helper.predictSigns('ca');
            return assert.deepEqual(value,  ['cancer', 'capricornio']);
        });

        it('returns correct predict signs with three letters', function() {
            var value = helper.predictSigns('pis');
            return assert.deepEqual(value,  ['piscis']);
        });

        it('returns correct predict signs with three letters', function() {
            var value = helper.predictSigns('cap');
            return assert.deepEqual(value,  ['capricornio']);
        });

        it('returns correct predict signs with full sign', function() {
            var value = helper.predictSigns('cancer');
            return assert.deepEqual(value,  ['cancer']);
        });

        it('returns empty signs with empty string', function() {
            var value = helper.predictSigns('');
            return assert.deepEqual(value,  []);
        });

        it('returns empty signs with empty object', function() {
            var value = helper.predictSigns();
            return assert.deepEqual(value, []);
        });

        it('returns correct inline suggestion with full sign name', function() {
            var inlineSuggestion = helper.getInlineSuggestions('piscis', {'update_id': '123'});
            var expected = {
                'type': 'article',
                'id': '123',
                'title': 'Piscis',
                'input_message_content': {
                    'message_text': '<b>Piscis</b>',
                    'parse_mode': 'HTML'
                },
                'description': 'Horoscopo del dia para Piscis',
                'thumb_url': ''
            };
            return assert.deepEqual(inlineSuggestion, [expected]);
        });

        it('returns correct inline suggestion with single char', function() {
            var inlineSuggestion = helper.getInlineSuggestions('p', {'update_id': '123'});
            var expected = {
                'type': 'article',
                'id': '123',
                'title': 'Piscis',
                'input_message_content': {
                    'message_text': '<b>Piscis</b>',
                    'parse_mode': 'HTML'
                },
                'description': 'Horoscopo del dia para Piscis',
                'thumb_url': ''
            };
            return assert.deepEqual(inlineSuggestion, [expected]);
        });

        it('returns correct inline suggestion with two char', function() {
            var inlineSuggestion = helper.getInlineSuggestions('pi', {'update_id': '123'});
            var expected = {
                'type': 'article',
                'id': '123',
                'title': 'Piscis',
                'input_message_content': {
                    'message_text': '<b>Piscis</b>',
                    'parse_mode': 'HTML'
                },
                'description': 'Horoscopo del dia para Piscis',
                'thumb_url': ''
            };
            return assert.deepEqual(inlineSuggestion, [expected]);
        });

        it('returns empty inline suggestion', function() {
            var inlineSuggestion = helper.getInlineSuggestions('random', {'update_id': '123'});
            return assert.deepEqual(inlineSuggestion, []);
        });

        it('returns correct joinSuggestions', function() {
            var join = helper.joinSuggestions(['acuario', 'aries']);
            return assert.deepEqual(join, ['acuario o aries']);
        });

    });
});

describe('Handler Helper', function() {
    var helper = new HandlerHelper();
    var title = 'Horoscopos';
    var message = {
        'text': 'Hello',
        'originalRequest': {
            'message': true
        }
    };
    it('returns correct message for chat message', function() {
        var result = helper.handleRequest(message);
        return assert.equal(result, undefined);
    });
    it('returns correct inlineRequest for inline message', function() {
        message.text = 'Piscis';
        message.originalRequest = {
            'inline_query': true,
            'update_id': '123'
        };
        var expected = [{
            'type': 'article',
            'id': '123',
            'title': 'Piscis',
            'input_message_content': {
                'message_text': '<b>' + 'Piscis' + '</b>',
                'parse_mode': 'HTML'
            },
            'description': 'Horoscopo del dia para Piscis',
            'thumb_url': ''
        }];
        var result = helper.handleRequest(message);
        return assert.eventually.deepPropertyNotVal(result, '0.thumb_url', '', 'Thumb url is not empty');
    });
    it('returns correct inlineRequest for inline message with single char', function() {
        message.text = 'p';
        message.originalRequest = {
            'inline_query': true,
            'update_id': '123'
        };
        var expected = [{
            'type': 'article',
            'id': '123',
            'title': 'Piscis',
            'input_message_content': {
                'message_text': '<b>' + 'Piscis' + '</b>',
                'parse_mode': 'HTML'
            },
            'description': 'Horoscopo del dia para Piscis',
            'thumb_url': ''
        }];
        var result = helper.handleRequest(message);
        return assert.eventually.deepPropertyNotVal(result, '0.thumb_url', '', 'Thumb url is not empty');
    });
    it('returns correct inlineRequest for inline message with two char', function() {
        message.text = 'ac';
        message.originalRequest = {
            'inline_query': true,
            'update_id': '123'
        };
        var expected = [{
            'type': 'article',
            'id': '123',
            'title': 'Acuario',
            'input_message_content': {
                'message_text': '<b>' + 'Acuario' + '</b>',
                'parse_mode': 'HTML'
            },
            'description': 'Horoscopo del dia para Acuario',
            'thumb_url': ''
        }];
        var result = helper.handleRequest(message);
        return assert.eventually.deepPropertyNotVal(result, '0.thumb_url', '', 'Thumb url is not empty');
    });
    it('returns correct inlineRequest for inline message with three char', function() {
        message.text = 'can';
        message.originalRequest = {
            'inline_query': true,
            'update_id': '123'
        };
        var expected = [{
            'type': 'article',
            'id': '123',
            'title': 'Cancer',
            'input_message_content': {
                'message_text': '<b>' + 'Cancer' + '</b>',
                'parse_mode': 'HTML'
            },
            'description': 'Horoscopo del dia para Cancer',
            'thumb_url': ''
        }];
        var result = helper.handleRequest(message);
        return assert.eventually.deepPropertyNotVal(result, '0.thumb_url', '', 'Thumb url is not empty');
    });
    it('returns correct inlineRequest for inline message for multiple suggestions - single letter', function() {
        message.text = 'a';
        message.originalRequest = {
            'inline_query': true,
            'update_id': '123'
        };
        var suggestion = '¿Acuario O Aries?';
        var description = '¿Horoscopo del dia para acuario o aries?';
        var expected = [{
            'type': 'article',
            'id': '123',
            'title': title,
            'input_message_content': {
                'message_text': '<b>' + suggestion + '</b>',
                'parse_mode': 'HTML'
            },
            'description': description,
            'thumb_url': ''
        }];
        var result = helper.handleRequest(message);
        return expect(result).to.eventually.deep.eq(expected);
    });
    it('returns correct inlineRequest for inline message for multiple suggestions - two letter', function() {
        message.text = 'ca';
        message.originalRequest = {
            'inline_query': true,
            'update_id': '123'
        };
        var suggestion = '¿Cancer O Capricornio?';
        var description = '¿Horoscopo del dia para cancer o capricornio?';
        var expected = [{
            'type': 'article',
            'id': '123',
            'title': title,
            'input_message_content': {
                'message_text': '<b>' + suggestion + '</b>',
                'parse_mode': 'HTML'
            },
            'description': description,
            'thumb_url': ''
        }];
        var result = helper.handleRequest(message);
        return expect(result).to.eventually.deep.eq(expected);
    });

    it('returns empty inlineRequest for inline message with invalid sign', function() {
        message.text = 'z';
        message.originalRequest = {
            'inline_query': true,
            'update_id': '123'
        };
        var result = helper.handleRequest(message);
        return expect(result).to.eventually.deep.eq([]);
    });
    it('returns correct inlineRequest for inline message with integer update_id', function() {
        message.text = 'p';
        message.originalRequest = {
            'inline_query': true,
            'update_id': 1234566
        };
        var result = helper.handleRequest(message);
        return assert.eventually.deepPropertyNotVal(result, '0.thumb_url', '', 'Thumb url is not empty');
    });


});