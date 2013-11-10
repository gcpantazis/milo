// ---------------------------
// This is Milo's initializer.
// ---------------------------

'use strict';

var fs = require('fs'),
  express = require('express'),
  jsonMinify = require('jsonminify'),
  jade = require('jade'),
  html = require('html'),
  _ = require('underscore');

_.str = require('underscore.string');
_.mixin(_.str.exports());

var app = express();

// Milo Library Modules

var jadeHelpers = require('./lib/jade-helpers'),
  routeValidate = require('./lib/validate-route');

var defaults = {
  'port': 3000
};

module.exports.express = express;

module.exports.use = function() {
  app.use.apply(app, arguments);
};

module.exports.init = function(config) {

  config = _.extend(defaults, config);

  var bindRoute = function(routeFile) {

    app.get(routeFile.route, function(req, res, next) {

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
          var renderedJade = jade.renderFile(layoutPath, data);
          res.end(html.prettyPrint(renderedJade, {
            'indent_size': 2
          }));
        } else if (data.service) {
          var services = require(process.cwd() + '/' + config.servicesDir + '/' + data.service);

          _.each(services, function(service) {
            service(req, res, next);
          });
        }
      } else {
        res.writeHead(404);
        res.end('404 - NOT FOUND');
      }
    }, function() {
      // Do nothing.
    });
  };

  // Bind static directories.

  _.each(config.staticDirs, function(staticDir) {
    app.use(staticDir, express.static(config.appDir + staticDir));
  });

  fs.readdir(config.routesDir, function(err, files) {

    _.each(files, function(file) {

      if (file.split('.').pop() === 'json') {

        file = fs.readFileSync(config.routesDir + '/' + file).toString();

        // I like having comments in the routes file, as they will likely be logical.
        // `.minify` strips comments out before parsing.

        bindRoute(JSON.parse(jsonMinify(file)));
      }

    });

    // Temporary. 404 should probably be part of the base install...
    // I need it in a few places.

    app.get('*', function(req, res) {
      res.writeHead(404);
      res.end('404 - NOT FOUND');
    });

    console.log('-----------------------------------');
    console.log('Milo is listening on localhost:' + config.port);
    console.log('-----------------------------------\n');

    app.listen(config.port);
  });
};