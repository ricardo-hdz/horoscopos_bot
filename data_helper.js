'use strict';
var _ = require('lodash');
var rp = require('request-promise');
var mockData = require('./data_mock');
var retry = 'Por el momento no puedo proporcionarte el horoscopo del dia. Intenta mas tarde.';
// var ENDPOINT = 'http://services.faa.gov/airport/status/';
var horoscopesArray = [];

function DataHelper() {}

DataHelper.prototype.requestDailyHoroscope = function() {
    return this.getDailyHoroscopes().then(function(response) {
        var horoscopesArray = response.body['channel']['item'];
        return horoscopesArray;
    });
};

DataHelper.prototype.requestHoroscopeBySign = function(sign) {
    var filterHoroscopes = function(horoscopes) {
        var signStartcase = _.startCase(sign);

        var requestedSign = _.filter(horoscopes, function(o) {
            return o.title === signStartcase;
        });

        return requestedSign && requestedSign.length > 0 ? requestedSign[0] : {
            'description': retry
        };
    };

    if (!_.isEmpty(horoscopesArray)) {
        return filterHoroscopes(horoscopesArray);
    } else {
        return this.requestDailyHoroscope().then(function(horoscopes) {
            return filterHoroscopes(horoscopes);
        });
    }
};

DataHelper.prototype.getDailyHoroscopes = function() {
    var options = {
        method: 'GET',
        uri: 'http://www.tvnotas.com.mx/rss/feed/tvn-horoscopo.json',
        resolveWithFullResponse: true,
        json: true
    };
    return rp(options);
};

module.exports = DataHelper;