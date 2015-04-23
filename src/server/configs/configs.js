
module.exports = {
	"authToken" : "asd98a7s9898asdaSDA(asd987asda*(&*&%))",
  "sendLogs" : true,
  "logs":[
    {
      "name":"hipchat",
      "level":2,
      "bundle":"node-hipchat",
      "afterRequire": function(loggers){
        loggers.hipchatLog = new loggers.hipchat("0e69a14a8e7089743b1f6fdd20add3");
      },
      log : function(loggers, type, messageText, messageJson){
        var params = {
            room: "1414827",
            from: 'Email Server',
            message: messageText,
            color: 'yellow'
          };

        loggers.hipchatLog.postMessage(params, function(data) {
          console.log(data);
        });
      }
    },
    {
      "name":"logentries",
      "level":1,
      "bundle":"le_node",
      "afterRequire": function(loggers){
        loggers.logentriesLog = loggers.logentries.logger({
          token:'304edc63-95d8-4540-b8ae-a6a67a78dfff'
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
  ],
  "service" : "MailGun",
  "failOver" : "SendGrid"
	/*
	"tags": {
      "blockStart": '[%',
      "blockEnd": '%]',
      "variableStart": '[$',
      "variableEnd": '$]',
      "commentStart": '[#',
      "commentEnd": '#]'
    }
    */
};