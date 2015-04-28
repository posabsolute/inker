var request = require('supertest');
var configs = require('../src/server/configs/configs');
var api = require('../src/server/server');

describe('Template generation', function() {

  it('401 if auth token is wrong', function(done) {
    request(api)
    .get('/collections/data_example/templates/index?name=Cedric&loop[]=1&loop[]=2&loop[]=3')
    .set('x-authorization-token', '123myapikey')
    .auth('incorrect', 'credentials')
    .expect(401, done);
  });

  it('401 if auth token is undefined', function(done) {
    request(api)
    .get('/collections/data_example/templates/index?name=Cedric&loop[]=1&loop[]=2&loop[]=3')
    .expect(401, done);
  });


  it('400 if template is undefined', function(done) {
    request(api)
    .get('/collections/data_examples/templates/index')
    .set('x-authorization-token', configs.authToken)
    .expect(400, done);
  });

  it('200 when auth token is right & template is right', function(done) {
    request(api)
    .get('/collections/data_example/templates/index?name=Cedric&loop[]=1&loop[]=2&loop[]=3')
    .set('x-authorization-token', configs.authToken)
    .expect(200, done);
  });

  it('Should use french data', function(done) {
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

  it('Should have data added to the template', function(done) {
    request(api)
    .get('/collections/data_example/templates/index?name=Cedric')
    .set('x-authorization-token', configs.authToken)
    .expect(function(res){
  		if (res.text.indexOf("Cedric") === -1) {
  			return "missing name from template";
  		}
    })
    .end(done);
  });

});