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
      if (typeof child === 'object' && instObj[key]) {
        resultsObj[key] = {};
        walker(child, instObj[key], resultsObj[key]);
      }
      if (typeof child === 'string') {
        if (isValid(config, child, instObj[key])) {
          resultsObj[key] = instObj[key];
        }
      }
    });
  };

  walker(model, instance, result);

  return result;
};