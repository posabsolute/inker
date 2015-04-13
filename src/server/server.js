var express = require('express');
var fs = require('fs');

var nunjucks = require('nunjucks');
var bodyParser = require('body-parser');
var emails_controller = require('./controller.emails');
var templates_controller = require('./controller.templates');
var configs = require('./configs');

var app = express();
/**
 * Setup nunjucks template base path
 * Setup nunjucks custom syntax
 */
nunjucks.configure(__dirname +"/../../dist/output/", {
    express: app,
    tags : configs.tags
});
/**
 * Accept post data
 */
app.use(bodyParser.json());   // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
  extended: true
})); 
/**
 * Routes
 */
app.get('/collections/*/templates/*', templates_controller.getOne);
app.post('/emails', emails_controller.create);
/**
 * Start server
 */
var server = app.listen(3000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);

});