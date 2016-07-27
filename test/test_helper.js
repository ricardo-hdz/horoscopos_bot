'use strict';

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var expect = chai.expect;
var DataHelper = require('../data_helper');
chai.config.includeStack = true;

describe('Data Helper', function() {
    var helper = new DataHelper();
    var sign;

    describe('requestDailyHoroscope', function() {
        context('with a valid sign', function() {
            it('returns correct object', function() {
                sign = 'Acuario';
                var value = helper.requestDailyHoroscope(sign).then(function(obj) {
                  return obj;
                });
                return expect(value).to.eventually.have.property('description');
            });

            it('returns correct object with lowercase sign', function() {
                sign = 'acuario';
                var value = helper.requestDailyHoroscope(sign).then(function(obj) {
                  return obj;
                });
                return expect(value).to.eventually.have.property('description');
            });
        });
    });
});