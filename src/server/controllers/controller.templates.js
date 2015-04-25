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
      	var data = req.query || {},
      		locale = req.params.locale || "en_US",
      		tplURL = locale + '/' + req.params.folder + '/' + req.params.name + '.html',
      		templateHtml = templates_controller.renderTemplate(tplURL, data);

  	  	//res.render(templateHtml);
  	  	res.send(templateHtml);
	},
	/**
	 * Render template with custom data using nunjucks
	 * @return {html} return complete template html
	 */
	renderTemplate : function(template, data){
		return nunjucks.render(template, data);
		try{
      		return nunjucks.render(template, data);
      	}catch(error){
      		logs_service.log(error.message, "crit");
      		throw new Error(error);
      	}
	}
};
module.exports = templates_controller;