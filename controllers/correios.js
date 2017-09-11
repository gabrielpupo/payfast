var soap = require('soap');

module.exports = function(app){

  app.post('/correios/calculoprazo', function(req, res){
    var dadosDaEntrega = req.body;
    var correiosSOAPClient = new app.servicos.correiosSOAPClient();

    correiosSOAPClient.calculaPrazo(dadosDaEntrega, function(err, resultado){
      if (err){
        res.status(500).send(err);
        return;
      }else{
        console.log('');
        res.status(200).send(resultado);
      }
    });

  });

}
