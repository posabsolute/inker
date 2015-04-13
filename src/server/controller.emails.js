var express = require('express');
var fs = require('fs');

var bodyParser = require('body-parser');
var nodemailer = require('nodemailer');
var wellknown = require('nodemailer-wellknown');
var configs = require('./configs');
var serviceAuthConfigs = require('./servicesAuth');
var templates_controller = require('./controller.templates');
var app = express();

var emails_controller = {
	/**
	 * Render template with custom data using nunjucks
	 * @return {html} return complete template html
	 * 
	 */
	create : function(req, res){
		// require auth token
		if(req.headers["x-authorization-token"] !== configs.authToken){
			return res.sendStatus(401);
		}
		// get post data
		var data = req.body.data.variables || {};
		// render template with nunjucks
		var templateHtml = templates_controller.renderTemplate(req.body.data.collection + "/" + req.body.data.template + ".html", data);
		// get service from post data
	  	var service = req.body.service.name || 'smtp';

	  	var transporter = nodemailer.createTransport({
	     	service: service, // <- resolved from the wellknown info
	     	auth: serviceAuthConfigs.services[service].auth
	  	});

	  	// setup e-mail data
	  	var mailOptions = req.body.options || {};
	  	mailOptions.html = templateHtml;
	  	// send mail with defined transport object
	  	transporter.sendMail(mailOptions, function(error, info){
	      	if(error){
	      		console.log(error);
	      	}else{
	      		console.log(info);
	      	}
	  	});

	  	res.send("success");
	}
};
module.exports = emails_controller;