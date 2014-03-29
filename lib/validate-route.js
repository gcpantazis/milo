// -------------------------------
// This is Milo's route validator.
// -------------------------------

'use strict';

var mustache = require('mustache'),
  _ = require('underscore');

// Milo Library Modules

var isValid = require('./validation-tests');

module.exports = function(config, data) {

  var assertions = mustache.render(JSON.stringify(data.validation), data),
    valid = true;

  if (assertions.length === 0) {
    return valid;
  }

  assertions = JSON.parse(assertions);

  _.each(assertions, function(test, value) {
    valid = isValid(config, test, value);
  });

  return valid;
};