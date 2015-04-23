
module.exports = {
  "authToken" : "asd98a7s9898asdaSDA(asd987asda*(&*&%))",
  // main mailing service used to send email
  "service" : "MailGun",
  // failover service when main service is down
  "failOver" : "SendGrid",

  // active logs
  /* "sendLogs" : ['hipchat','logentries'], */

  // logs configs
  "logs" : {
    "hipchat":{
      "room" : "HIPCHAT_ROOM_ID",
      "token" : "MY_TOKEN"
    },
    "logentries" : {
      "token" : "MY_TOKEN"
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