var restify = require('restify');

var client = restify.createJsonClient({
  url:"http://localhost:3001",
  version:"~1.0"
});

client.post('/cartoes/autoriza', function(){
  console.log('consumindo servico de cartoes');
});
