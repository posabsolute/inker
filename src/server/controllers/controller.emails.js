var express = require('express');
var fs = require('fs');

var bodyParser = require('body-parser');
var nodemailer = require('nodemailer');
var wellknown = require('nodemailer-wellknown');
var configs = require('../configs/configs');
var serviceAuthConfigs = require('../configs/servicesAuth');
var templates_controller = require('../controllers/controller.templates');

// logging with hipchat
if(configs.hipchat){
	var hipchat = require('node-hipchat');
	var HC = new hipchat(configs.hipchat.apikey);
}

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
	  	var service = req.body.service.name || configs.service  || 'smtp';
	  	// get email service provider
	  	var transporter = emails_controller.getTransporter(service);
	  	// setup e-mail data
	  	var mailOptions = req.body.options || {};
	  	mailOptions.html = templateHtml;
	  	mailOptions.failOver = req.body.service.failover;
	  	// send mail with defined transport object
	  	emails_controller.sendEmail(mailOptions, transporter);

	  	// You can choose to be sync but your response will be bound by your email service speed.
	  	if(!configs.sync){
	  		res.send("Email has been sent to "+service);
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
	sendEmail : function(mailOptions, transporter, failOver){
		transporter.sendMail(mailOptions, function(error, info){
	      	if(error){
	      		// We can resend the email if we have a failover provider
	      		var failOverService = mailOptions.failOver || configs.failOver || undefined;
	      		if(failOverService && !failOver){
	      			var transporter = emails_controller.getTransporter(failOverService);
	      			emails_controller.sendEmail(mailOptions, transporter, true);
	      		}
	      		// you can setup logs in configs.js
	      		if(configs.logs === true){
	      			emails_controller.log(error);
	      		}

			  	if(configs.sync){
			  		res.send(error);
			  	}	      		
	      		console.log(error);

	      	// success
	      	}else{
	      		if(configs.sync){
			  		res.send(info);
			  	}	   
	      		console.log(info);
	      	}
	  	});
	},
	// You can add logging systems here, 
	// By default inker only support hipchat
	log: function(error){
		if(configs.hipchat){
			emails_controller.sendLogHipchat(error);
		}
	},
	sendLogHipchat : function(error){
		var params = {
		  room: configs.hipchat.room,
		  from: 'Email Server',
		  message: JSON.stringify(error),
		  color: 'yellow'
		};

		HC.postMessage(params, function(data) {
		  console.log(data);
		});
	}
};
module.exports = emails_controller;