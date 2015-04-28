var request = require('supertest');
var chai = require("chai");
var sinon = require("sinon");
var sinonChai = require("sinon-chai");
chai.should();
chai.use(sinonChai);

var configs = require('../src/server/configs/configs');
var logs_service = require('../src/server/services/service.logs');

var api = require('../src/server/server');
var logger = sinon.spy(logs_service, 'log');

describe('Logs services', function() {
	
  it('Should log when template is undefined', function(done) {
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

    .end(function(err, res){
        logger.should.have.returned({ 
        	loggers: [ 'hipchat', 'logentries' ],
  			message: '"template not found: en_US/data_examples/index.html"' 
  		});
        done();
    });
  });

  it('Should log when wrong email provider credential ', function(done) {
    var data = {
      "data" : { "collection": "data_example", "template": "index",
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

    .end(function(err, res){
        logger.should.have.returned({ 
        	loggers: [ 'hipchat', 'logentries' ],
  			message: '{"code":"EAUTH","response":"535 5.7.0 Mailgun is not loving your login or password","responseCode":535}'
  		});

        done();
    });
  });
});