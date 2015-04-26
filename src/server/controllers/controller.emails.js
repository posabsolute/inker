var express = require('express'),
	fs = require('fs'),
	
	bodyParser = require('body-parser'),
	nodemailer = require('nodemailer'),
	wellknown = require('nodemailer-wellknown'),
	logs_service = require('../services/service.logs'),
	configs = require('../configs/configs'),
	serviceAuthConfigs = require('../configs/configs.providers.auth'),
	templates_controller = require('../controllers/controller.templates'),
	
	app = express();

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
		var data = req.body.data.variables || {},
			// Get language used
			locale = req.body.data.locale || "en_US",
			// render template with nunjucks
			tplURL =  templates_controller.getTemplate(locale, req.body.data.collection, req.body.data.template),
			templateHtml = templates_controller.renderTemplate(tplURL, data, res),
			// get service from post data
	  		service = req.body.service.name || configs.service  || 'smtp',
	  		// get email service provider
	  		transporter = emails_controller.getTransporter(service),
	  		// setup e-mail data
	  		mailOptions = req.body.options || {};

	  	mailOptions.html = templateHtml;
	  	mailOptions.failOver = req.body.service.failover;
	  	mailOptions.service = service;
	  	mailOptions.template = tplURL;
	  	// send mail with defined transport object
	  	emails_controller.sendEmail(mailOptions, transporter, undefined, res);

	  	// You can choose to be sync but your response will be bound by your email service speed.
	  	if(!configs.sync){
	  		res.status(200).json({
	  			"service": service,
	  			"async"  : true,
	  			template : tplURL
	  		});
	  	}
	  	
	},
	/**
	 * Render template with custom data using nunjucks
	 * @return {objet} return nodemail transport with email provider
	 * 
	 */
	getTransporter : function(service){
		return nodemailer.createTransport({
	     	service: service, // <- resolved from the wellknown info
	     	auth: serviceAuthConfigs.services[service].auth
	  	});
	},
	sendEmail : function(mailOptions, transporter, failOver, res){
		transporter.sendMail(mailOptions, function(error, info){
	      	if(error){
	      		// We can resend the email if we have a failover provider
	      		var failOverService = mailOptions.failOver || configs.failOver || undefined;
	      		if(failOverService && !failOver){
	      			var transporter = emails_controller.getTransporter(failOverService);
	      			emails_controller.sendEmail(mailOptions, transporter, true, res);
	      		}
	      		// you can setup logs in configs.js
	      		if(configs.sendLogs && configs.sendLogs.length){
	      			var level = error.level || "crit";
	      			logs_service.log(error, level);
	      		}
	      		// Inker is async by default sending you back the fastest response possible
	      		// Errors must be logged elsewhere
	      		// if we are sync it wait for the  service provider to respond & send back the error directly
			  	if(configs.sync){
			  		var status = error.responseCode || 400;
	      			res.status(status).json({
			  			"provider": mailOptions.service,
			  			"async"  : false,
			  			"template" : mailOptions.template,
			  			"providerInfo" : error
			  		});			  		
			  	}	      		
	      		console.log(error);
	      	// success
	      	}else{
	      		// Inker is async by default sending you back the fastest response possible
	      		// if we are sync it wait for the service provider to respond
	      		if(configs.sync){
	      			res.status(200).json({
			  			"provider": mailOptions.service,
			  			"async"  : false,
			  			"template" : mailOptions.template,
			  			"providerInfo" : info
			  		});
			  	}	   
	      		console.log(info);
	      	}
	  	});
	}
};
module.exports = emails_controller;