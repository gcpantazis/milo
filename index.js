// ---------------------------
// This is Milo's initializer.
// ---------------------------

'use strict';

var fs = require('fs'),
  express = require('express')(),
  jsonMinify = require('jsonminify'),
  jade = require('jade'),
  _ = require('underscore');

_.str = require('underscore.string');
_.mixin(_.str.exports());

// Milo Library Modules

var jadeHelpers = require('./lib/jade-helpers'),
  routeValidate = require('./lib/validate-route');

var defaults = {
  'port': 3000
};

module.exports.use = function(cb) {
  express.use(cb);
};

module.exports.init = function(config) {

  config = _.extend(defaults, config);

  var bindRoute = function(routeFile) {

    express.get(routeFile.route, function(req, res) {

      var layoutPath = config.layoutsDir + '/' + _.slugify(_.humanize(routeFile.layout)) + '.jade';

      var data = {};
      data.path = req.params;

      _.extend(data, routeFile);
      _.extend(data, jadeHelpers(config, data));

      // Validate that the matched request meets all of the validation criteria
      // Set out in the route's JSON file.

      if (routeValidate(config, data)) {
        if (data.layout) {
          res.writeHead(200);
          res.end(jade.renderFile(layoutPath, data));
        } else if (data.service) {
          var services = require(process.cwd() + '/' + config.servicesDir + '/' + data.service);

          _.each(services, function(service) {
            service(req, res, data);
          });
        } else {
          res.writeHead(500);
          res.end('500 - ROUTE NOT MAPPED TO VALID OUTPUT');
        }
      } else {
        res.writeHead(404);
        res.end('404 - NOT FOUND');
      }
    });
  };

  fs.readdir(config.routesDir, function(err, files) {

    _.each(files, function(file) {
      file = fs.readFileSync(config.routesDir + '/' + file).toString();

      // I like having comments in the routes file, as they will likely be logical.
      // `.minify` strips comments out before parsing.

      bindRoute(JSON.parse(jsonMinify(file)));
    });

    // Temporary. 404 should probably be part of the base install...
    // I need it in a few places.

    express.get('*', function(req, res) {
      res.writeHead(404);
      res.end('404 - NOT FOUND');
    });

    console.log('-----------------------------------');
    console.log('Milo is listening on localhost:' + config.port);
    console.log('-----------------------------------\n');

    express.listen(config.port);
  });
};