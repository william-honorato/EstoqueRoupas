// biblioteca js que faz o mapeamento das pastas em função do server.js
require('rootpath')(); 
// Inicialização do express. 
var express = require('express');
// bibloteca que ajuda no parse de mensagens requisitadas que contém JSON
var bodyParser = require('body-parser');

// Criação da API e indicação que trabalha com JSON
var api = express();
api.use(bodyParser.urlencoded({ extended: false }));
api.use(bodyParser.json());
api.use('/api/estoque', require('./controllers/api/estoque.controller'));
api.use('/api/about', require('./controllers/api/about.controller'));


// process.env.PORT é uma variável injetada pelo Azure Web App. Caso ela não exista, será utilizada a porta fixa (6000)
var apiPort = process.env.PORT || 6000;


// start server API
var serverAPI = api.listen(apiPort, function () {
    console.log('Server API listening at http://' + serverAPI.address().address + ':' + serverAPI.address().port);
});