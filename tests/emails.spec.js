var request = require('supertest');
var configs = require('../src/server/configs/configs');
var api = require('../src/server/server');

describe('Email Delivery Service', function() {

  it('401 if auth token is wrong', function(done) {
    request(api)
    .post('/emails')
    .set('x-authorization-token', '123myapikey')
    .auth('incorrect', 'credentials')
    .expect(401, done);
  });

  it('401 if auth token is undefined', function(done) {
    request(api)
    .post('/emails')
    .expect(401, done);
  });

  it('400 if template is undefined', function(done) {
    var data = {
      "data" : { "collection": "data_examples", "template": "index",
        "variables": { "name":"Cedric", "loop": ["1","2","3"] }
      },
      "options" : { "from": "sender@address", "to": "cedric@gmail.com", "subject": "hello", "text": "hello world!"
      },
      "service" : { "name":"MailGun" }
    };
    request(api)
    .post('/emails')
    .set('x-authorization-token', configs.authToken)
    .send(data)
    .expect(400, done);
  });

  it('Should be sent correctly to Mandrill when async', function(done) {
    var data = {
      "data" : { "collection": "data_example", "template": "index",
        "variables": { "name":"Cedric", "loop": ["1","2","3"] }
      },
      "options" : { "from": "sender@address", "to": "cedric@gmail.com", "subject": "hello", "text": "hello world!"
      },
      "service" : { "name": "Mandrill" }
    };
    request(api)
    .post('/emails')
    .set('x-authorization-token', configs.authToken)
    .send(data)
    .expect(function(res){
      if(res.body.provider !== "Mandrill"){
        return "Should have used Mandrill";
      }
      if(res.statusCode !== 200){
        return "Call should have been a success";
      }


    })
    .end(done);
  });

  it('Should fail sending & use default failover when sync', function(done) {
    var data = {
      "data" : { "collection": "data_example", "template": "index",
        "variables": { "name":"Cedric", "loop": ["1","2","3"] }
      },
      "options" : { "failOver": "SendGrid", "sync" : true, "from": "sender@address", "to": "cedric@gmail.com", "subject": "hello", "text": "hello world!" },
      "service" : { "name": "MailGun" }
    };
    request(api)
    .post('/emails')
    .set('x-authorization-token', configs.authToken)
    .send(data)
    .expect(function(res){
      console.log(res.body);
      if(res.body.provider !== "SendGrid"){
        return "Should have used SendGrid";
      }
      if(res.body.statusCode === 200){
        return "Call should have failed";
      }


    })
    .end(done);
  });

  it('Expect french data to be used', function(done) {
    request(api)
    .get('/collections/data_example/templates/index/locale/fr_CA?name=Cedric&loop[]=1&loop[]=2&loop[]=3')
    .set('x-authorization-token', configs.authToken)
    .expect(function(res){
  		if (res.text.indexOf("fr_CA") === -1) {
  			return "Missing french string set in fr_CA";
  		}
    })
    .end(done);
  });

});