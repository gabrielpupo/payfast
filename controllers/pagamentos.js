module.exports = function(app){

  // ROTA DE TESTE
  app.get('/pagamentos', function(req, res){
    console.log('Recebida requisicao de teste na porta 3000.')
    res.send('OK.');
  });


  // ROTA PARA INCLUSÃO DE UM NOVO PAGAMENTO
  app.post('/pagamentos/pagamento', function(req, res){
    console.log('processando uma requisicao de um novo pagamento');

    var pagamento = req.body;

    req.assert("forma_de_pagamento","Forma de pagamento eh obrigatorio").notEmpty();
    req.assert("valor","Valor eh obrigatorio e deve ser um decimal").notEmpty().isFloat();

    var erros = req.validationErrors();

    if (erros){
      console.log('Erros de validacao encontrados');
      res.status(400).send(erros);
      return;
    }

    pagamento.status = 'CRIADO';
    pagamento.data = new Date;

    var connection = app.persistencia.connectionFactory();
    var pagamentoDao = new app.persistencia.PagamentoDao(connection);

    pagamentoDao.salva(pagamento, function(erro, resultado){
      if(erro){
        console.log('Erro ao inserir no banco:' + erro);
        res.status(500).send(erro);
      } else {
      console.log('Pagamento Criado. ID: ' + resultado.insertId);
      res.location('/pagamentos/pagamento/' + resultado.insertId);
      res.status(201).json(pagamento);
      }
      connection.end();
    });
  });

  //ROTA PARA CONFIRMAR OS PAGAMENTOS
  app.put('/pagamentos/pagamento/:id', function(req, res){
    var pagamento = {};
    var id = req.params.id;

    pagamento.id = id;
    pagamento.status = 'CONFIRMADO';
    pagamento.data = new Date;

    var connection = app.persistencia.connectionFactory();
    var pagamentoDao = new app.persistencia.PagamentoDao(connection);

    pagamentoDao.atualiza(pagamento, function(erro,resultado){
      if (erro){
        res.status(500).send(erro);
      }else{
        console.log('Pagamento ID ' + pagamento.id + ' confirmado');
        res.status(200).send(pagamento);
      }
    });
    connection.end();
  });


  //ROTA PARA CANCELAR PAGAMENTOS
  app.delete('/pagamentos/pagamento/:id', function(req,res){
    var pagamento = {};
    pagamento.id = req.params.id;
    pagamento.status = 'CANCELADO';

    var connection = app.persistencia.connectionFactory();
    var pagamentoDao = new app.persistencia.PagamentoDao(connection);

    pagamentoDao.atualiza(pagamento, function(erro,resultado){
      if(erro){
        res.status(500).send(erro);
      }else{
        console.log('Pagamento ID ' + pagamento.id + ' cancelado');
        res.status(200).send(pagamento);
      }
    });
    connection.end();
  });




}
