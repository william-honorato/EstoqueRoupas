// biblioteca js que faz o mapeamento das pastas em função do server.js
require('rootpath')(); 
// Inicialização do express. 
var express = require('express');
// bibloteca que ajuda no parse de mensagens requisitadas que contém JSON
var bodyParser = require('body-parser');

var expressJwt = require('express-jwt');
// carrega as configurações mapeadas no json
var config = require('config.json');

// Criação da API e indicação que trabalha com JSON
var api = express();

//Todos os endpoints usaram validação pelo JWT, menos os passados em unless
api.use('/api', expressJwt({ secret: config.secret }).unless({ path: ['/api/users/authenticate', '/api/users/register'] }));

api.use(bodyParser.urlencoded({ extended: false }));
api.use(bodyParser.json());
api.use('/api/estoque', require('./controllers/api/estoque.controller'));
api.use('/api/about', require('./controllers/api/about.controller'));
api.use('/api/users', require('./controllers/api/users.controller'));
//api.use('/app', require('./controllers/app/index.controller'));

// process.env.PORT é uma variável injetada pelo Azure Web App. Caso ela não exista, será utilizada a porta fixa (6000)
var apiPort = process.env.PORT || 6000;

// start server API
var serverAPI = api.listen(apiPort, function () {
    console.log('Server API listening at http://' + serverAPI.address().address + ':' + serverAPI.address().port);
});