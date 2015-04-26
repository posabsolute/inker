var configs = require('../configs/configs'),
	loggers = require('../configs/configs.logs'),
	logSystems = {};


var logs_service = {
	/**
	 * Setup log providers to be ready to be used
	 */
	init : function(){
		if(configs.sendLogs && configs.sendLogs.length){
			// Instantiate all the log systems
			configs.sendLogs.forEach(function(logger){
			 	// require modules 
			 	logSystems[logger] = require(loggers[logger].module);
			 	// Instantiate log service & add it to logSystems
			 	loggers[logger].afterRequire(logSystems);
			});
		}
	},
	/**
	 * send logs to all log services defined in config.js
	 */
	log : function(message, level){
		if(configs.sendLogs && configs.sendLogs.length){
			var messageTxt = JSON.stringify(message);
			configs.sendLogs.forEach(function(logger){
				loggers[logger].log(logSystems, level, messageTxt, message);
			});
		}
	}

};

logs_service.init();

module.exports = logs_service;