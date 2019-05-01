var express = require('express');
var router = express.Router();
var estoqueService = require('services/estoque.service');

// routes
router.post('/criar', criarEstoqueRoupa);
router.get('/:_id', pegarEstoqueRoupa);
router.get('/', listarEstoqueRoupa);
router.put('/', atualizarEstoqueRoupa);
router.delete('/:_id', deletarEstoqueRoupa);

module.exports = router;


function criarEstoqueRoupa(req, res) {
    estoqueService.create(req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function listarEstoqueRoupa(req, res) {

    estoqueService.listEstoque()
        .then(function (estoqueParam) {
            if (estoqueParam) {
                res.send(estoqueParam);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function pegarEstoqueRoupa(req, res) {
    var idRoupa = req.param('_id');
    estoqueService.getById(idRoupa)
        .then(function (roupa) {
            if (roupa) {
                res.send(roupa);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function atualizarEstoqueRoupa(req, res) {
    estoqueService.update(req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function deletarEstoqueRoupa(req, res) {
    var idRoupa = req.param('_id');
    estoqueService.delete(idRoupa)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}