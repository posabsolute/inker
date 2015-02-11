var express = require('express');
var fs = require('fs');

var nunjucks = require('nunjucks');
var bodyParser = require('body-parser');
var nodemailer = require('nodemailer');
var wellknown = require('nodemailer-wellknown');
var configs = require('./configs');
var serviceAuthConfigs = require('./servicesAuth');
var app = express();

var mail_controller = {
	/**
	 * Render template with custom data
	 * Require receiving the template src link & data, 
	 * @return {html} return complete template html
	 */
	getTemplate : function(req, res){
		// require auth token
		if(req.headers["x-authorization-token"] !== configs.authToken){
			return res.sendStatus(401);
		}
		// get post data
      	var data = req.body || {};
      	var templateHtml = mail_controller.renderTemplate(req.params[0], data);

  	  	//res.render(templateHtml);
  	  	res.send(templateHtml);
	},
	/**
	 * Render template with custom data using nunjucks
	 * @return {html} return complete template html
	 */
	renderTemplate : function(template, data){
		return nunjucks.render(template, data);
	},
	/**
	 * Render template with custom data using nunjucks
	 * @return {html} return complete template html
	 * 
	 */
	send : function(req, res){
		// require auth token
		if(req.headers["x-authorization-token"] !== configs.authToken){
			return res.sendStatus(401);
		}
		// get post data
		var data = req.body.template.data || {};
		// render template with nunjucks
		var templateHtml = mail_controller.renderTemplate(req.body.template.src, data);
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
	      		res.statusCode = error.responseCode;
	        	res.send(error);
	      	}else{
	        	res.send(info);
	      	}
	  	});
	}
};
module.exports = mail_controller;