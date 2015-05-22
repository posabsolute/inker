
module.exports = {
	"authToken" : "asd98a7s9898asdaSDA(asd987asda*(&*&%))",
  // main mailing service used to send email
  "service" : "MailGun",
  // failover service when main service is down
  "failOver" : "SendGrid",
  // active logs
  "sendLogs" : ['logentries',"pushbullet", "slack"],
  // logs configs
  "logs" : {
    "hipchat":{
      "room" : "1414827",
      "token" : "0e69a14a8e7089743b1f6fdd20add3"
    },
    "logentries" : {
      "token" : "304edc63-95d8-4540-b8ae-a6a67a78dfff"
    },
    "slack" : {
      "hook_url" : "https://hooks.slack.com/services/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",
      "options" : {}
    },
    // Push notification with push bullet, 
    // it's free however you need to create an accout & install the app
    // https://www.pushbullet.com
    "pushbullet" : {
      // found in account settings
      "token" : "lFj4OQPvPJlWRTYcIGPYUAP8vZIyesP5",
      // Should be on the left on the website once you connected a device
      // When you click on it get the id from URL
      // You can have multiple devices 
      "devicesID" : ["ujxidFX0QHksjAiVsKnSTs"]
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