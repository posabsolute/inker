var configs = require('./configs');

module.exports = {
	"hipchat": {
      // not currently used
      "level":2,
      // Module required for the log provider 
      "module":"node-hipchat",
      // Executed after the module is loaded in
      // Generally used to instanciate the provider
      "afterRequire": function(loggers){
        loggers.hipchatLog = new loggers.hipchat(configs.logs.hipchat.token);
      },
      // Actual log function
      // loggers is passed bavk & contains all the logs providers.
      log : function(loggers, type, messageText, messageJson){
        var params = {
            room: configs.logs.hipchat.room,
            from: 'Email Server',
            message: messageText,
            color: 'yellow'
          };

        loggers.hipchatLog.postMessage(params, function(data) { });
      }
	},
    "logentries": {
      "level":1,
      "module":"le_node",
      "afterRequire": function(loggers){
        loggers.logentriesLog = loggers.logentries.logger({
          token: configs.logs.logentries.token
        });

        loggers.logentriesLog.on('error',function(err){
          console.log('hangs around.... In bars!? '+err );
        });

      },
      log : function(loggers, type, messageText, messageJson){
        var data = messageJson || messageText;

        loggers.logentriesLog.log(type, data);
      }
    }
};