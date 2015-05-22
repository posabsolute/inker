
module.exports = {
  "authToken" : "asd98a7s9898asdaSDA(asd987asda*(&*&%))",
  // main mailing service used to send email
  "service" : "MailGun",
  // failover service when main service is down
  "failOver" : "SendGrid",

  // active logs
  /* "sendLogs" : ['hipchat','logentries', 'pushbullet', 'slack'], */

  // logs configs
  "logs" : {
    "hipchat":{
      "room" : "HIPCHAT_ROOM_ID",
      "token" : "MY_TOKEN"
    },
    "logentries" : {
      "token" : "MY_TOKEN"
    },
    "slack" : {
      "hook_url" : "MY_HOOK",
      //"channel" : "Channel Override"
      "options" : {}
    },
    // Push notification with push bullet, 
    // it's free however you need to create an accout & install the app
    // https://www.pushbullet.com
    "pushbullet" : {
      // found in account settings
      "token" : "MY_TOKEN",
      // Should be on the left on the website once you connected a device
      // When you click on it get the id from URL
      // You can have multiple devices 
      "devicesID" : []
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