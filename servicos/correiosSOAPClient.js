var soap = require('soap');

function CorreiosSOAPClient(){
  this._url = 'http://ws.correios.com.br/calculador/CalcPrecoPrazo.asmx?wsdl';
}

CorreiosSOAPClient.prototype.calculaPrazo = function(args, callback){

  soap.createClient(this._url, function(err, client){
    console.log('cliente soap criado');
    client.CalcPrazo(args, callback);

  });

}

module.exports = function(dados){
  return CorreiosSOAPClient;
}
