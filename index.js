// ---------------------------
// This is Milo's initializer.
// ---------------------------

var http = require('http'),
  fs = require('fs'),
  ramrod = require('ramrod')(),
  jsonminify = require('jsonminify'),
  jade = require('jade'),
  _ = require('underscore');

_.str = require('underscore.string');
_.mixin(_.str.exports());

// Milo Library Modules

var jadeHelpers = require('./lib/jade-helpers'),
  routeValidate = require('./lib/validate-route');

var defaults = {
  'port': 3000
}

module.exports.init = function(config) {

  config = _.extend(defaults, config);

  var bindRoute = function(routeFile) {

    ramrod.add(routeFile.route, function(req, res, data) {

      var layoutPath = config.layoutsDir + '/' + _.slugify(_.humanize(routeFile.layout)) + '.jade';

      data = _.extend(data, routeFile, jadeHelpers(config, data));

      // Validate that the matched request meets all of the validation criteria
      // Set out in the route's JSON file.

      if (routeValidate(config, data)) {
        res.writeHead(200);
        res.end(jade.renderFile(layoutPath, data));
      } else {
        res.writeHead(404);
        res.end('404 - NOT FOUND');
      }
    });
  }

  fs.readdir(config.routesDir, function(err, files) {

    _.each(files, function(file) {
      file = fs.readFileSync(config.routesDir + '/' + file).toString();

      // I like having comments in the routes file, as they will likely be logical.
      // `.minify` strips comments out before parsing.

      bindRoute(JSON.parse(JSON.minify(file)));
    })

    // Temporary. 404 should probably be part of the base install...
    // I need it in a few places.

    ramrod.on('*', function(req, res) {
      res.writeHead(404);
      res.end('404 - NOT FOUND');
    });

    console.log('-----------------------------------');
    console.log('Milo is listening on localhost:' + config.port);
    console.log('-----------------------------------\n');

    http.createServer(function(req, res) {
      ramrod.dispatch(req, res);
    }).listen(config.port);

  });
}