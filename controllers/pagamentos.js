
module.exports = function(app){

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