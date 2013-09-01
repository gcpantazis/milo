// --------------------------------
// This is Milo's object validator.
// --------------------------------

'use strict';

var mustache = require('mustache'),
  _ = require('underscore');

// Milo Library Modules

var isValid = require('./validation-tests');

module.exports = function(config, validationObject, routeData) {

  var result = '',
    rules;

  if (typeof validationObject === 'string') {
    result = validationObject;
  }

  if (typeof validationObject === 'object') {

    rules = mustache.render(JSON.stringify(validationObject), routeData);
    rules = JSON.parse(rules);

    for (var i in rules) {
      var valid = true;

      _.each(rules[i].validation, function(test, value) {
        if (!isValid(config, test, value)) {
          valid = false;
        }
      });

      if (valid) {
        result = rules[i].then;
        break;
      } else {
        result = '';
      }
    }
  }

  return result;
};