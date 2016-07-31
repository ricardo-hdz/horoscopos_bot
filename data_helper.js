'use strict';
var _ = require('lodash');
var rp = require('request-promise');
var retry = 'Por el momento no puedo proporcionarte el horoscopo del dia. Intenta mas tarde.';

var horoscopesArray = [];
var NAMES_ONE_CHAR = {
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
var NAMES_TWO_CHAR = {
    'ac': ['acuario'],
    'ar': ['aries'],
    'ca': ['cancer', 'capricornio'],
    'le': ['leo'],
    'li': ['libra']
};
var NAMES_THREE_CHAR = {
    'can': ['cancer'],
    'cap': ['capricornio']
};

function DataHelper() {}

/**
* Request daily horoscope to service. Returns array of horoscoped by sign.
*/
DataHelper.prototype.requestDailyHoroscope = function() {
    return this.getDailyHoroscopes().then(function(response) {
        var horoscopesArray = response.body['channel']['item'];
        return horoscopesArray;
    });
};

/*
* Returns an array of sign name suggestions based on a string chain.
* Eg. 'a' returns corresponding sign names 'acuario', 'aries'
*/
DataHelper.prototype.predictSigns = function(sign) {
    var shortSign = '';
    if (_.isString(sign) && sign.length > 0) {
        sign = _.trim(sign);
        sign = _.lowerCase(sign);

        if (sign.length > 2) {
            shortSign = sign.substr(0,3);
            if (_.has(NAMES_THREE_CHAR, shortSign)) {
                return NAMES_THREE_CHAR[shortSign];
            } else {
                return this.predictSigns(sign.substr(0,2));
            }
        } else if (sign.length == 2) {
            if (_.has(NAMES_TWO_CHAR, sign)) {
                return NAMES_TWO_CHAR[sign];
            } else {
                return this.predictSigns(sign.substr(0,1));
            }
        } else if (sign.length == 1) {
            return _.has(NAMES_ONE_CHAR, sign) ? NAMES_ONE_CHAR[sign] : [];
        }
    } else {
        return [];
    }
};

/*
* Utility method to join an array of string
*/
DataHelper.prototype.joinSuggestions = function(suggestions) {
    var text = _.join(suggestions, ' o ');
    return [text];
};

/*
* Constructs and returns an array of InlineQueryResults
* to reply to an inline request
*/
DataHelper.prototype.getInlineSuggestions = function(sign, originalRequest) {
    var suggestions = this.predictSigns(sign);

    if (suggestions.length > 0) {
        var title = 'Horoscopos';
        var description = '';
        var message = '';
        var request = false;

        if (suggestions.length > 1) {
            message = this.joinSuggestions(suggestions);
            description = '¿Horoscopo del dia para ' + message + '?';
            message = '¿' + _.startCase(message) + '?';
        } else {
            message = _.startCase(suggestions[0]);
            title = message;
            description = 'Horoscopo del dia para ' + message;
            request = true;
        }

        var inlines = [];

        inlines.push(
            {
                'type': 'article',
                'id': _.toString(originalRequest.update_id),
                'title': title,
                'input_message_content': {
                    'message_text': '<b>' + message + '</b>',
                    'parse_mode': 'HTML'
                },
                'description': description,
                'thumb_url': ''
            }
        );
        return inlines;
    } else {
        return [];
    }
};

/*
* Orchestrates async calls for an inline query
*/
DataHelper.prototype.getInlineHoroscope = function(sign, originalRequest) {
    var inlines = this.getInlineSuggestions(sign, originalRequest);

    if (inlines.length === 0 || (inlines.length === 1 && inlines[0].title === 'Horoscopos')) {
        return new Promise(function(resolve, reject) {
            resolve(inlines);
        });
    } else {
        var sign = inlines[0].title;
        return this.requestHoroscopeBySign(sign).then(function(data) {
            inlines[0].input_message_content.message_text = sign + ':' + data.description;
            inlines[0].thumb_url = data.enclosure['@attributes'].url;
            return inlines;
        });
    }
}

/**
* Makes a service request to get the data associated with the horoscope sign
*/
DataHelper.prototype.requestHoroscopeBySign = function(sign) {
    var filterHoroscopes = function(horoscopes) {
        var signStartcase = _.startCase(sign);

        var requestedSign = _.filter(horoscopes, function(o) {
            return _.startCase(o.title) === signStartcase;
        });

        return requestedSign && requestedSign.length > 0 ? requestedSign[0] : {
            'description': retry
        };
    };

    return this.requestDailyHoroscope().then(function(horoscopes) {
        return filterHoroscopes(horoscopes);
    });
};

/**
* GET call to retrieve full horoscope data
*/
DataHelper.prototype.getDailyHoroscopes = function() {
    var options = {
        method: 'GET',
        uri: 'TBD',
        resolveWithFullResponse: true,
        json: true
    };
    return rp(options);
};

module.exports = DataHelper;