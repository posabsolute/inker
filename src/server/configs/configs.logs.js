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
            notification: true,
            message: messageText,
            color: 'yellow'
          };

        loggers.hipchatLog.postMessage(params, function(data) { });
      }
	},
  "slack": {
      // not currently used
      "level":2,
      // Module required for the log provider 
      "module":"node-slack",
      // Executed after the module is loaded in
      // Generally used to instanciate the provider
      "afterRequire": function(loggers){
        loggers.slackLog = new loggers.slack(configs.logs.slack.hook_url, configs.logs.slack.options);
      },
      // Actual log function
      // loggers is passed back & contains all the logs providers.
      log : function(loggers, type, messageText, messageJson){
        var params = {
            username: 'Email Server',
            text: messageText
          };
        // Slack use a default channel by default
        if(configs.logs.slack.channel){
          params.channel = configs.logs.slack.channel;
        }

        loggers.slackLog.send(params, function(data) { });
      }
  },
  "pushbullet": {
      // Module required for the log provider 
      "module":"pushbullet",
      // Executed after the module is loaded in
      // Generally used to instanciate the provider
      "afterRequire": function(loggers){
        loggers.pushbulletLog = new loggers.pushbullet(configs.logs.pushbullet.token);
      },
      // Actual log function
      // loggers is passed back & contains all the logs providers.
      log : function(loggers, type, messageText, messageJson){
        // for all device ID's
        configs.logs.pushbullet.devicesID.forEach(function(device){
          // push notification
          loggers.pushbulletLog.note(device, "Email Server Error", messageText, function(error, response) {
              // response is the JSON response from the API 
          });
        });
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