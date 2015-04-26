
module.exports = {
	"authToken" : "asd98a7s9898asdaSDA(asd987asda*(&*&%))",
  // main mailing service used to send email
  "service" : "MailGun",
  // failover service when main service is down
  "failOver" : "SendGrid",
  // active logs
  "sendLogs" : ['hipchat','logentries'],

  "sync" : true,
  // logs configs
  "logs" : {
    "hipchat":{
      "room" : "1414827",
      "token" : "0e69a14a8e7089743b1f6fdd20add3"
    },
    "logentries" : {
      "token" : "304edc63-95d8-4540-b8ae-a6a67a78dfff"
    }
  }
  // nunjucks custom tags
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