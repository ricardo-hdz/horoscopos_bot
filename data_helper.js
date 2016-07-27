'use strict';
var _ = require('lodash');
var rp = require('request-promise');
var mockData = require('./data_mock');
// var ENDPOINT = 'http://services.faa.gov/airport/status/';

function DataHelper() {}

DataHelper.prototype.requestDailyHoroscope = function(sign) {
    return this.getDailyHoroscopes().then(function(response) {
        var horoscopes = response.body['channel']['item'];
        var signStartcase = _.startCase(sign);

        var requestedSign = _.filter(horoscopes, function(o) {
            return o.title === signStartcase;
        });
        return requestedSign && requestedSign.length > 0 ? requestedSign[0] : [];
    });
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