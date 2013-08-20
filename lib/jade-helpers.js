// ------------------------------
// These are Milo's jade helpers.
// ------------------------------

var fs = require('fs'),
  jade = require('jade'),
  mustache = require('mustache'),
  _ = require('underscore');

// Milo Library Modules

var validateObject = require('./validate-object');

module.exports = function(config, routeData) {

  var self = {

    // An object for storing render data between modules. Probably best to use
    // in conjunction with `getData` at the start of a layout.

    state: {},

    // Grabs a model of a provided `module` with a given `id`.

    getData: function(module, id) {

      var data = {},
        path, file;

      try {
        // Here, I could remap the JSON to a different location...
        path = config.modulesDir + '/' + module + '/models/' + id + '.json'
        file = fs.readFileSync(path).toString();
        data = JSON.parse(file);
      } catch (e) {
        console.log(e);
      }

      return data;
    },

    // Renders the provided `module` with the model matching the provided `id`.

    renderSingle: function(module, id) {

      var output = '',
        locals = {};

      if (id) {

        // Apply validation to an object.
        id = validateObject(config, id, routeData);

        locals = self.getData(module, id);
      }

      _.extend(locals, self);

      try {
        output = jade.renderFile(config.modulesDir + '/' + module + '/layout.jade', locals);
      } catch (e) {
        console.log(e);
      }

      return output;
    },

    // Given an array of modules, renders all of them sequentially using `renderSingle`.

    renderAll: function(modules) {

      var output = '';

      // Render the module data with the `routeData` object.
      modules = JSON.parse(mustache.render(JSON.stringify(modules), routeData));

      for (var i in modules) {
        output += self.renderSingle(modules[i].module, modules[i].id);
      }

      return output;
    }
  };

  return self;
}