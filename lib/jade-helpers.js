// ------------------------------
// These are Milo's jade helpers.
// ------------------------------

'use strict';

var jade = require('jade'),
  md = require('node-markdown').Markdown,
  mustache = require('mustache'),
  _ = require('underscore');

// Milo Library Modules

var validateObject = require('./validate-object'),
  validateModel = require('./validate-model');

module.exports = function(config, routeData) {

  var fileSystemHelpers = require('./fs-helpers')(config);

  var self = {

    // An object for storing render data between modules. Probably best to use
    // in conjunction with `getData` at the start of a layout.

    state: {},

    // Exposes `fileSystemHelpers.getData()` method to jade templates.

    getData: fileSystemHelpers.getData,

    // Renders the provided `module` with the model matching the provided `id`.

    renderSingle: function(module, id) {

      var output = '',
        locals = {};

      locals.module = {
        'name': module
      };

      if (id) {

        // Apply validation to an object.
        id = validateObject(config, id, routeData);

        locals.module.id = id;

        var model = fileSystemHelpers.getModel(module),
          modelInstance = validateModel(config, model, self.getData(module, id));

        _.extend(locals, modelInstance);
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
    },

    renderMarkdown: function(module, id, fileName) {

      var output = '';

      output += fileSystemHelpers.getFile(module, id, fileName).toString();
      output = md(output, true);

      return output;
    }
  };

  return self;
};