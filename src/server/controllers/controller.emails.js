var express = require('express');
var fs = require('fs');

var bodyParser = require('body-parser');
var nodemailer = require('nodemailer');
var wellknown = require('nodemailer-wellknown');
var configs = require('../configs/configs');
var serviceAuthConfigs = require('../configs/servicesAuth');
var templates_controller = require('../controllers/controller.templates');

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
	create : function(req, res, failOver){
		// require auth token
		if(req.headers["x-authorization-token"] !== configs.authToken){
			return res.sendStatus(401);
		}
		// get post data
		var data = req.body.data.variables || {};
		// render template with nunjucks
		var templateHtml = templates_controller.renderTemplate(req.body.data.collection + "/" + req.body.data.template + ".html", data);
		// get service from post data
	  	var service = req.body.service.name || failOver || 'smtp';

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
	      		// We can resend the email if we have a failover system
	      		if(req.body.service.failover && !failOver){
	      			emails_controller.create(req, res, req.body.service.failover);
	      		}

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
	  	if(!configs.sync){
	  		res.send("success");
	  	}
	  	
	},

	log: function(error){
		var params = {
		  room: configs.hipchat.room, // Found in the JSON response from the call above
		  from: 'Email Server',
		  message: JSON.stringify(error),
		  color: 'yellow'
		};

		HC.postMessage(params, function(data) {
			
		  console.log(params);
		});
	}
};
module.exports = emails_controller;