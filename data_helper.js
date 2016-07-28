'use strict';
var _ = require('lodash');
var rp = require('request-promise');
var mockData = require('./data_mock');
var retry = 'Por el momento no puedo proporcionarte el horoscopo del dia. Intenta mas tarde.';
// var ENDPOINT = 'http://services.faa.gov/airport/status/';
var horoscopesArray = [];
var NAMES = {
    'a': ['acuario', 'aries'],
    'p': ['piscis'],
    't': ['tauro'],
    'g': ['geminis'],
    'c': ['cancer', 'capricornio'],
    'l': ['leo', 'libra'],
    'v': ['virgo'],
    'e': ['escorpio'],
    's': ['sagitario']
};

function DataHelper() {}

DataHelper.prototype.requestDailyHoroscope = function() {
    return this.getDailyHoroscopes().then(function(response) {
        var horoscopesArray = response.body['channel']['item'];
        return horoscopesArray;
    });
};

DataHelper.prototype.isSignValid = function(sign) {
    var pos = this.getFirstLetterOfSign(sign);
    return _.has(NAMES, pos) ? true : false;
};

DataHelper.prototype.getFirstLetterOfSign = function(sign) {
    sign = _.trim(sign);
    if (sign.length > 0) {
        sign = _.lowerCase(sign);
        return sign.charAt(0);
    } else {
        return '';
    }
};

DataHelper.prototype.predictSigns = function(sign) {
    var pos = this.getFirstLetterOfSign(sign);
    return _.has(NAMES, pos) ? NAMES[pos] : [];
};

DataHelper.prototype.getInlineSuggestions = function(sign, originalRequest) {
    var suggestions = this.predictSigns(sign);
    var inlines = [];
    for (var i = 0, suggestion; (suggestion = suggestions[i]); i++) {
        suggestion = _.startCase(suggestion);
        inlines.push(
            {
                'type': 'article',
                'id': originalRequest.update_id,
                'title': suggestion,
                'input_message_content': {
                    'message_text': '<b>' + suggestion + '</b>',
                    'parse_mode': 'HTML'
                },
                'description': 'Horoscopo del dia para ' + suggestion
            }
        );
    }
    return inlines;
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