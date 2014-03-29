// -------------------------------
// This is Milo's model validator.
// -------------------------------

'use strict';

var _ = require('underscore');

var isValid = require('./validation-tests');

module.exports = function(config, model, instance) {

  var result = {};

  var walker = function(obj, instObj, resultsObj) {
    _.each(obj, function(child, key) {

      if (_.isArray(child) && instObj[key]) {
        var tests = new Array(instObj[key].length + 1);

        tests = tests.join(1).split('').map(function() {
          return child[0];
        });

        resultsObj[key] = {};
        walker(tests, instObj[key], resultsObj[key]);
      } else if (_.isObject(child) && instObj[key]) {
        resultsObj[key] = {};
        walker(child, instObj[key], resultsObj[key]);
      } else if (_.isString(child) && instObj[key]) {
        if (isValid(config, child, instObj[key])) {
          resultsObj[key] = instObj[key];
        }
      }

    });
  };

  walker(model, instance, result);

  return result;
};