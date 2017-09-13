module.exports = function(app){
<<<<<<< HEAD
=======

<<<<<<< HEAD
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
=======
  const PAGAMENTO_CRIADO = "CRIADO";
  const PAGAMENTO_CONFIRMADO = 'CONFIRMADO';
  const PAGAMENTO_CANCELADO = 'CANCELADO';
  const PAGAMENTO_NAO_AUTORIZADO = 'NAO AUTORIZADO';

>>>>>>> f6e91e35d78a23fcc8877e8ec2b16ad5206cc8d4
  // ROTA DE TESTE
>>>>>>> d36e415067b66c925cf0df070634578bf23ed634
  app.get('/pagamentos', function(req, res){
    console.log('Recebida requisicao de teste na porta 3000.')
    res.send('OK.');
  });

  app.delete('/pagamentos/pagamento/:id', function(req, res){
    var pagamento = {};
    var id = req.params.id;

    pagamento.id = id;
    pagamento.status = 'CANCELADO';

    var connection = app.persistencia.connectionFactory();
    var pagamentoDao = new app.persistencia.PagamentoDao(connection);

    pagamentoDao.atualiza(pagamento, function(erro){
        if (erro){
          res.status(500).send(erro);
          return;
        }
        console.log('pagamento cancelado');
        res.status(204).send(pagamento);
    });
  });

  app.put('/pagamentos/pagamento/:id', function(req, res){

    var pagamento = {};
    var id = req.params.id;

    pagamento.id = id;
    pagamento.status = 'CONFIRMADO';

    var connection = app.persistencia.connectionFactory();
    var pagamentoDao = new app.persistencia.PagamentoDao(connection);

    pagamentoDao.atualiza(pagamento, function(erro){
        if (erro){
          res.status(500).send(erro);
          return;
        }
        console.log('pagamento criado');
        res.send(pagamento);
    });

  });

  app.post('/pagamentos/pagamento', function(req, res){

    req.assert("pagamento.forma_de_pagamento",
        "Forma de pagamento eh obrigatorio").notEmpty();
    req.assert("pagamento.valor",
      "Valor eh obrigatorio e deve ser um decimal")
        .notEmpty().isFloat();

    var erros = req.validationErrors();

    if (erros){
      console.log('Erros de validacao encontrados');
      res.status(400).send(erros);
      return;
    }

    var pagamento = req.body["pagamento"];
    console.log('processando uma requisicao de um novo pagamento');

    pagamento.status = 'CRIADO';
    pagamento.data = new Date;

    var connection = app.persistencia.connectionFactory();
    var pagamentoDao = new app.persistencia.PagamentoDao(connection);

    pagamentoDao.salva(pagamento, function(erro, resultado){
      if(erro){
        console.log('Erro ao inserir no banco:' + erro);
        res.status(500).send(erro);
      } else {
      pagamento.id = resultado.insertId;
      console.log('pagamento criado');

      if (pagamento.forma_de_pagamento == 'cartao'){
        var cartao = req.body["cartao"];
        console.log(cartao);

        var clienteCartoes = new app.servicos.clienteCartoes();

        clienteCartoes.autoriza(cartao,
            function(exception, request, response, retorno){
              if(exception){
                console.log(exception);
                res.status(400).send(exception);
                return;
              }
              console.log(retorno);

              res.location('/pagamentos/pagamento/' +
                    pagamento.id);

              var response = {
                dados_do_pagamanto: pagamento,
                cartao: retorno,
                links: [
                  {
                    href:"http://localhost:3000/pagamentos/pagamento/"
                            + pagamento.id,
                    rel:"confirmar",
                    method:"PUT"
                  },
                  {
                    href:"http://localhost:3000/pagamentos/pagamento/"
                            + pagamento.id,
                    rel:"cancelar",
                    method:"DELETE"
                  }
                ]
              }

              res.status(201).json(response);
              return;
        });


      } else {
        res.location('/pagamentos/pagamento/' +
              pagamento.id);

        var response = {
          dados_do_pagamanto: pagamento,
          links: [
            {
              href:"http://localhost:3000/pagamentos/pagamento/"
                      + pagamento.id,
              rel:"confirmar",
              method:"PUT"
            },
            {
              href:"http://localhost:3000/pagamentos/pagamento/"
                      + pagamento.id,
              rel:"cancelar",
              method:"DELETE"
            }
          ]
        }

        res.status(201).json(response);
      }
    }
    });

  });
}
>>>>>>> 9cb0b8c23691ef5958d70d4e91367ffd02b3da81
