// ----------------------------------
// These are Milo's validation tests.
// ----------------------------------

'use strict';

var fs = require('fs'),
  _ = require('underscore');

module.exports = function(config, test, value) {

  var isValid = true,
    file;

  // `isModelOf:`: Validates that the compared value is a valid `id`, matching
  //    the module provided in the test.

  if (test.search('isModelOf:') === 0) {

    test = test.substr(10);

    try {
      file = fs.readFileSync(config.modulesDir + '/' + test + '/models/' + value + '.json').toString();
    } catch (e) {
      isValid = false;
    }

    // `matchesPattern:`: Validates that the compared value against a `RegExp`string.

  } else if (test.search('matchesPattern:') === 0) {

    test = test.substr(15);

    var match = value.match(new RegExp(test, 'i'));

    if (!match) {
      isValid = false;
    }

    // `equals:`: Simple equality test.

  } else if (test.search('equals:') === 0) {

    test = test.substr(7);

    if (value !== test) {
      isValid = false;
    }

    // `is:`: confirm that value matches a certain type. Accepts test of the
    //    JavaScript types `String`, `Boolean`, and `Number`.

  } else if (test.search('is:') === 0) {

    test = test.substr(3);

    var theType = 'string';

    // I'm coaxing this to work, obviously. But models might list "1" and expect
    // that to be a number, which would be wrong even though it would pass
    // this validation. Need to re-think this a bit.

    // The bigger problem, validation needs to work on both keys and values...
    // The routes come back as keys for validation, while I'm effectively validating
    // values for the model's schema. Blargh. More likely I need to rethink
    // the schema/model.json structure again.

    if (value.toString().match(new RegExp('[0-9]{1,}', 'i'))) {
      theType = 'number';
    } else if (value.toString().match(new RegExp('true|false', 'i'))) {
      theType = 'boolean';
    } else if (_.isString(value)) {
      var valueSplit = value.split('.');
      if (valueSplit[valueSplit.length - 1] === 'md') {
        theType = 'markdownfile';
      } else {
        theType = 'string';
      }
    }

    if (test.toLowerCase() !== theType) {
      isValid = false;
    }
  }

  return isValid;
};