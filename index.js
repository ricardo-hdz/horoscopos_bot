'use strict';

var _ = require('lodash');
var DataHelper = require('./data_helper');
var parseJson = require('parse-json');

var app = function() {
    var dataHelper = new DataHelper();
    var requestDailyHoroscope = function() {
        dataHelper.requestDailyHoroscope().then(function(response) {
            return response;
        });
    };

    return {
        requestDailyHoroscope: requestDailyHoroscope
    };
};

module.exports = app;