var express = require('express'),
	fs = require('fs'),

	nunjucks = require('nunjucks'),
	bodyParser = require('body-parser'),
	configs = require('../configs/configs'),
	logs_service = require('../services/service.logs'),
	serviceAuthConfigs = require('../configs/servicesAuth'),
	app = express();

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
		return nunjucks.render(template, data, function (err, str) {
			if(err){
				logs_service.log({"error": err.message}, "crit");	
	    		throw new Error(err);			
			}

  		});
	}
};
module.exports = templates_controller;