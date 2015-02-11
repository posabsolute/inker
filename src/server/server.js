var express = require('express');
var fs = require('fs');

var nunjucks = require('nunjucks');
var bodyParser = require('body-parser');
var mail_controller = require('./controller.mail');
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
app.use( bodyParser.json() );   // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
  extended: true
})); 
/**
 * Routes
 */
app.post('/templates/*', mail_controller.getTemplate);
app.post('/mail/send', mail_controller.send);
/**
 * Start server
 */
var server = app.listen(3000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);

});