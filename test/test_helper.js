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
            it('returns correct arra of horoscopes', function() {
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

        it('returns sign is valid', function() {
            var value = helper.isSignValid('Acuario');
            return assert.equal(value, true);
        });

        it('returns sign is invalid', function() {
            var value = helper.isSignValid('random');
            return assert.equal(value, false);
        });

        it('returns correct predict signs with one letter', function() {
            var value = helper.predictSigns('a');
            return assert.deepEqual(value,  ['acuario', 'aries']);
        });

        it('returns correct predict signs with sign', function() {
            var value = helper.predictSigns('acuario');
            return assert.deepEqual(value,  ['acuario', 'aries']);
        });

        it('returns empty signs with empty string', function() {
            var value = helper.predictSigns('');
            return assert.deepEqual(value,  []);
        });

        it('returns empty signs with empty object', function() {
            var value = helper.predictSigns();
            return assert.deepEqual(value,  []);
        });

        it('returns correct inline suggestion', function() {
            var inlineSuggestion = helper.getInlineSuggestions('piscis', {'update_id': '123'});
            var expected = {
                'type': 'article',
                'id': '123',
                'title': 'Piscis',
                'input_message_content': {
                    'message_text': '<b>Piscis</b>',
                    'parse_mode': 'HTML'
                },
                'description': 'Horoscopo del dia para Piscis'
            };
            return assert.deepEqual(inlineSuggestion, [expected]);
        });

        it('returns empty inline suggestion', function() {
            var inlineSuggestion = helper.getInlineSuggestions('random', {'update_id': '123'});
            return assert.deepEqual(inlineSuggestion, []);
        });

    });
});

describe('Handler Helper', function() {
    var helper = new HandlerHelper();
    var message = {
        'text': 'Hello',
        'originalRequest': {
            'message': true
        }
    };
    it('returns correct message for chat message', function() {
        var result = helper.handleRequest(message);
        return assert.equal(result, 'Hello');
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
            'description': 'Horoscopo del dia para Piscis'
        }];
        var result = helper.handleRequest(message);
        return assert.eventually.deepEqual(result, expected);
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
            'description': 'Horoscopo del dia para Piscis'
        }];
        var result = helper.handleRequest(message);
        return expect(result).to.eventually.deep.eq(expected);
        // return assert.eventually.deepEqual(result, expected);
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
});