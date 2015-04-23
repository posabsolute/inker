var configs = require('configs');

module.export = {
	"hipchat": {
      "level":2,
      "module":"node-hipchat",
      "afterRequire": function(loggers){
        loggers.hipchatLog = new loggers.hipchat(configs.hipchat.token);
      },
      log : function(loggers, type, messageText, messageJson){
        var params = {
            room: configs.hipchat.room,
            from: 'Email Server',
            message: messageText,
            color: 'yellow'
          };

        loggers.hipchatLog.postMessage(params, function(data) {
          console.log(data);
        });
      }
	},
    "logentries": {
      "level":1,
      "module":"le_node",
      "afterRequire": function(loggers){
        loggers.logentriesLog = loggers.logentries.logger({
          token: configs.logentries.token
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