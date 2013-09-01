// -------------------------------------
// These are Milo's file system helpers.
// -------------------------------------

'use strict';

var fs = require('fs');

module.exports = function(config) {

  var self = {

    // Grabs a model of a provided `module` with a given `id`.

    getData: function(module, id) {

      var data = {},
        path, file;

      try {
        // Here, I could remap the JSON to a different location...
        path = config.modulesDir + '/' + module + '/models/' + id + '.json';
        file = fs.readFileSync(path).toString();
        data = JSON.parse(file);
      } catch (e) {
        console.log(e);
      }

      return data;
    },

    getFile: function(module, id, fileName) {
      var file = '',
        path;

      try {
        // Here, I could remap the files to a different location...
        path = config.modulesDir + '/' + module + '/models/' + id + '/' + fileName;
        file += fs.readFileSync(path);
      } catch (e) {
        console.log(e);
      }

      return file;
    }

  };

  return self;
};