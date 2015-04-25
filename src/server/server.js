var express = require('express'),
	fs = require('fs'),

	nunjucks = require('nunjucks'),
	bodyParser = require('body-parser'),
	emails_controller = require('./controllers/controller.emails'),
	templates_controller = require('./controllers/controller.templates'),
	configs = require('./configs/configs'),	

	app = express();
	
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