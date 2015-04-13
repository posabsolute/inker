var express = require('express');
var fs = require('fs');

var nunjucks = require('nunjucks');
var bodyParser = require('body-parser');
var configs = require('./configs');
var serviceAuthConfigs = require('./servicesAuth');
var app = express();

var templates_controller = {
	/**
	 * Render template with custom data
	 * Require receiving the template src link & data, 
	 * @return {html} return complete template html
	 */
	getOne : function(req, res){
		// require auth token
		if(req.headers["x-authorization-token"] !== configs.authToken){
			return res.sendStatus(401);
		}
		// get post data
      	var data = req.query || {};
      	var templateHtml = templates_controller.renderTemplate(req.params[0] + '/' + req.params[1] + '.html', data);

  	  	//res.render(templateHtml);
  	  	res.send(templateHtml);
	},
	/**
	 * Render template with custom data using nunjucks
	 * @return {html} return complete template html
	 */
	renderTemplate : function(template, data){
		return nunjucks.render(template, data);
	}
};
module.exports = templates_controller;