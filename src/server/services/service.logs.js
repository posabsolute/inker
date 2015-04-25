var configs = require('../configs/configs'),
	loggers = require('../configs/configs.logs');


if(configs.sendLogs && configs.sendLogs.length){
	var logSystems = {};
	// Extantiante all the log systems
	configs.sendLogs.forEach(function(logger){
	 	// require modules 
	 	logSystems[logger] = require(loggers[logger].module);
	 	// extanciate log service & add it to logSystems
	 	loggers[logger].afterRequire(logSystems);
	});
}


var logs_service = {
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

module.exports = logs_service;