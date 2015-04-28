var express = require('express'),
	fs = require('fs'),

	nunjucks = require('nunjucks'),
	bodyParser = require('body-parser'),
	configs = require('../configs/configs'),
	logs_service = require('../services/service.logs'),
	serviceAuthConfigs = require('../configs/configs.providers.auth'),
	
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
      	var data = req.query || {},
      		locale = req.params.locale || "en_US",
      		tplURL = templates_controller.getTemplate(locale, req.params.folder, req.params.name),
      		templateHtml = templates_controller.renderTemplate(tplURL, data, res);
      	
      	// when there is an error we return an object
	 	if(typeof templateHtml !== "string"){
	 		// stop the call use the response set in controller.templates.js
	 		return;
	 	}

  	  	//res.render(templateHtml);
  	  	res.send(templateHtml);
	},
	/**
	 * Find template path
	 * @return {string} return template url
	 */
	getTemplate : function(locale, folder, name){
		return locale + '/' + folder + '/' + name + '.html';
	},
	/**
	 * Render template with custom data using nunjucks
	 * @return {html} return complete template html
	 */
	renderTemplate : function(template, data, res){
		try{
      		return nunjucks.render(template, data);
      	}catch(error){
      		
      		logs_service.log(error.message, "crit");
      		var errorJson = {"error": error.message};
      		res.status(400).json(errorJson).end();
      		return errorJson;
      	}
	}
};
module.exports = templates_controller;