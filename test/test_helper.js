'use strict';

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var expect = chai.expect;
var assert = chai.assert;
var DataHelper = require('../data_helper');
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
});