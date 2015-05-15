var configs = require('../configs/configs'),
	loggers = require('../configs/configs.logs'),
	logSystems = {};

configs.
var logs_service = {
	/**
	 * Setup log providers to be ready to be used
	 */
	init : function(){
		if(configs.sendLogs && configs.sendLogs.length){
			// Instantiate all the log systems
			configs.sendLogs.forEach(function(logger){
				try{
				 	// require modules 
				 	logSystems[logger] = require(loggers[logger].module);
				 	// Instantiate log service & add it to logSystems
				 	loggers[logger].afterRequire(logSystems);					
				 }catch(e){
				 	console.warn("Logs provider is crashing: "+ e);
				 	return new Error(e);
				 }

			});
			return {
				loggers : configs.sendLogs
			};
		}
	},
	/**
	 * send logs to all log services defined in config.js
	 */
	log : function(message, level){
		// Logs providers are set in config.js
		if(configs.sendLogs && configs.sendLogs.length){
			var messageTxt = JSON.stringify(message);
			configs.sendLogs.forEach(function(logger){
				// for each provider we execute the log function
				try{
					loggers[logger].log(logSystems, level, messageTxt, message);
				}catch(e){
					console.warn("Logs provider is crashing: "+ e);
					return new Error(e);
				}
			});
		}
		console.log({
			"loggers" : configs.sendLogs,
			"message" : messageTxt
		});
		return {
			"loggers" : configs.sendLogs,
			"message" : messageTxt
		};
	}
};

logs_service.init();

module.exports = logs_service;