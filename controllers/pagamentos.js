module.exports = function(app){

<<<<<<< HEAD
    app.get('/pagamentos', function(req, res){
        console.log('requisição recebida na porta 3000')
        res.send('OK');
    });    

   app.get('/pagamentos/pagamento/:id', function(req, res){

        var id = req.params.id;

        var connection = app.persistencia.connectionFactory();
        var pagamentoDao = new app.persistencia.PagamentoDao(connection);

        pagamentoDao.buscaPorId(id, function(erro, results){

            if (results.length == 0){
                console.log('id inexistente');
                res.send('id inexistente');
            } else {
                console.log('requisição recebida na porta 3000')
                res.send(results);        
            }
        });        
    });        


    app.post('/pagamentos/pagamento', function(req, res){
        var pagamento = req.body;      

        req.assert("forma_de_pagamento", "forma de pagamento eh obrigatoria").notEmpty();
        req.assert("valor", "valor deve ser um decimal").isFloat();
        req.assert("valor", "valor eh obrigatorio").notEmpty();
        req.assert("moeda", "moeda deve ter no maximo 3 caracteres").isLength({max: 3});

        var erros = req.validationErrors();

        if (erros){
            console.log('existem erros de validação');
            res.status(400).send(erros);
            return;
        }

        pagamento.status = "CRIADO";
        pagamento.data = new Date;        

        var connection = app.persistencia.connectionFactory();
        var pagamentoDao = new app.persistencia.PagamentoDao(connection);

        pagamentoDao.salva(pagamento, function(erro, results){

            if (erro){
                res.status(500).send(erro);
                console.log('Erro: ' + erro);
                return;
            } else {
                console.log('Pagamento Criado ' + results);
                res.location('/pagamentos/pagamento/' + results.insertId);

                pagamento.id = results.insertId;

                res.status(201).json(pagamento);
            }
        });

        connection.end();

    });      

}
=======
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


  //ROTA PARA CANCELAR PAGAMENTOS !
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
>>>>>>> 9cb0b8c23691ef5958d70d4e91367ffd02b3da81
