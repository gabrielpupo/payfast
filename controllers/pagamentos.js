module.exports = function(app){

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
  app.get('/pagamentos', function(req, res){
    console.log('Recebida requisicao de teste na porta 3000.')
    res.send('OK.');
  });


  // ROTA PARA INCLUSÃO DE UM NOVO PAGAMENTO
  app.post('/pagamentos/pagamento', function(req, res){
    console.log('processando uma requisicao de um novo pagamento');

    var pagamento = req.body["pagamento"];
    var cartao = req.body["cartao"];

    req.assert("pagamento.forma_de_pagamento","Forma de pagamento eh obrigatorio").notEmpty();
    req.assert("pagamento.valor","Valor eh obrigatorio e deve ser um decimal").notEmpty().isFloat();

    var erros = req.validationErrors();

    if (erros){
      console.log('Erros de validacao encontrados');
      res.status(400).send(erros);
      return;
    }

    pagamento.status = PAGAMENTO_CRIADO;
    pagamento.data = new Date;

    var connection = app.persistencia.connectionFactory();
    var pagamentoDao = new app.persistencia.PagamentoDao(connection);

    pagamentoDao.salva(pagamento, function(erro, resultado){
      if(erro){
        console.log('Erro ao inserir no banco:' + erro);
        res.status(500).send(erro);

      }else{

        if(pagamento.forma_de_pagamento == 'cartao'){
          var clienteCartoes = new app.servicos.cartoesClient();
          clienteCartoes.autoriza(cartao, function(exception, request, response, retorno){

            if(exception){
              console.log(exception);
              res.status(400).send(exception);

            }else{
              pagamento.id = resultado.insertId;
              console.log('Pagamento ID ' + pagamento.id + ' Criado');
              res.location('/pagamentos/pagamento/' + pagamento.id);
              pagamento.status = retorno.dados_do_cartao.status;
              pagamentoDao.atualiza(pagamento, function(err, result){

                if (err){
                  res.status(500).send(err);

                }else{
                  var response = {
                    dados_do_pagamento: pagamento,
                    dados_do_cartao: cartao,
                    links: [
                      {
                        href:"http://localhost:3000/pagamentos/pagamento/" + pagamento.id,
                        rel:"CONFIRMAR",
                        method:"PUT"
                      },
                      {
                        href:"http://localhost:3000/pagamentos/pagamento/" + pagamento.id,
                        rel:"CANCELAR",
                        method:"DELETE"
                      }
                    ]
                  }
                  res.status(200).send(response);
                }
              });
            }
          });

        }else{
          pagamento.id = resultado.insertId;
          console.log('Pagamento ID ' + pagamento.id + ' Criado');
          res.location('/pagamentos/pagamento/' + pagamento.id);
          var response = {
            dados_do_pagamento: pagamento,
            links: [
              {
                href:"http://localhost:3000/pagamentos/pagamento/" + pagamento.id,
                rel:"CONFIRMAR",
                method:"PUT"
              },
              {
                href:"http://localhost:3000/pagamentos/pagamento/" + pagamento.id,
                rel:"CANCELAR",
                method:"DELETE"
              }
            ]
          }
          res.status(201).json(response);
        }
      }
    });
      //connection.end();
    });

  //ROTA PARA CONFIRMAR OS PAGAMENTOS
  app.put('/pagamentos/pagamento/:id', function(req, res){
    var pagamento = {};
    var id = req.params.id;

    pagamento.id = id;
    pagamento.status = PAGAMENTO_CONFIRMADO;
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
    pagamento.status = PAGAMENTO_CANCELADO;

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
