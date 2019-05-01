var config = require('config.json');
var Q = require('q');
var mongo = require('mongoskin');
var connection = process.env.connectionString || config.connectionString;
var db = mongo.db(connection, { native_parser: true });
db.bind('Estoque');

var service = {};
service.create = create;
service.getById = getById;
service.listEstoque = listEstoque;
service.update = update;
service.delete = _delete;

module.exports = service;

function create(roupaParam) {
    var deferred = Q.defer();

    db.collection("Roupas").findOne(
        { Marca: roupaParam.Marca, Cor: roupaParam.Cor, Tipo: roupaParam.Tipo },
        function (err, estoque) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            if (estoque) {
                // Marca, cor e tipo já existe no BD
                deferred.reject('Marca "' + roupaParam.Marca + '" já existe');
            } else {
                criarEstoqueRoupa();
            }
        });

    function criarEstoqueRoupa() {
        db.collection("Roupas").insert(
            roupaParam,
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                deferred.resolve();
            });
    }

    return deferred.promise;
}

function getById(_id) {
    var deferred = Q.defer();

    db.collection("Roupas").findById(_id, function (err, person) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (person) {
            // return user (without hashed password)
            deferred.resolve(person);
        } else {
            // user not found
            deferred.resolve();
        }
    });

    return deferred.promise;
}

function listEstoque() {
    var deferred = Q.defer();

    db.collection("Roupas").find().toArray(function (err, estoque) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (estoque) {
            // return user (without hashed password)
            deferred.resolve(estoque);
        } else {
            // user not found
            deferred.resolve();
        }
    });
    return deferred.promise;
}

function update(roupaParam) {
    var deferred = Q.defer();

    // validation
    db.collection("Roupas").findById(roupaParam.id, function (err, roupa) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (roupa) {
            updateRoupa();
        }
    });

    function updateRoupa() {
        var set = {
            DataEntrada: roupaParam.DataEntrada,
            Tipo: roupaParam.Tipo,
            Marca: roupaParam.Marca,
            Características: roupaParam.Características,
            Tamanho: roupaParam.Tamanho,
            Cor: roupaParam.Cor,
            ValorEtiquetaCompra: roupaParam.ValorEtiquetaCompra,
            ValorPagoCompra: roupaParam.ValorPagoCompra,
            ValorMargem100: roupaParam.ValorMargem100,
            PreçoSugerido: roupaParam.PreçoSugerido
        };

        db.collection("Roupas").update(
            { _id: mongo.helper.toObjectID(roupaParam.id) },
            { $set: set },
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                deferred.resolve();
            });
    }

    return deferred.promise;
}

function _delete(_id) {
    var deferred = Q.defer();

    db.collection("Roupas").remove(
        { _id: mongo.helper.toObjectID(_id) },
        function (err) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            deferred.resolve();
        });

    return deferred.promise;
}