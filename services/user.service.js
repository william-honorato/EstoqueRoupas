var config = require('config.json');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');
var mongo = require('mongoskin');
var db = mongo.db(config.connectionString, { native_parser: true });
db.bind('Estoque');

var service = {};

service.authenticate = authenticate;
service.getById = getById;
service.create = create;
service.update = update;
service.delete = _delete;

module.exports = service;

function authenticate(login, senha) {
    var deferred = Q.defer();

    db.collection("users").findOne({ login: login }, function (err, user) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (user && bcrypt.compareSync(senha, user.hash)) {
            // authentication successful
            deferred.resolve({token :jwt.sign({ sub: user._id }, config.secret), userId: user._id});
        } else {
            // authentication failed
            deferred.resolve();
        }
    });

    return deferred.promise;
}

function getById(_id) {
    var deferred = Q.defer();

    db.collection("users").findById(_id, function (err, user) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (user) {
            // return user (without hashed senha)
            deferred.resolve(_.omit(user, 'hash'));
        } else {
            // user not found
            deferred.resolve();
        }
    });

    return deferred.promise;
}

function create(userParam) {
    var deferred = Q.defer();

    // validation
    db.collection("users").findOne(
        { login: userParam.login },
        function (err, user) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            if (user) {
                // login already exists
                deferred.reject('O login "' + userParam.login + '" já está cadastrado');
            } else {
                createUser();
            }
        });

    function createUser() {
        // set user object to userParam without the cleartext senha
        var user = _.omit(userParam, 'senha');

        // add hashed senha to user object
        user.hash = bcrypt.hashSync(userParam.senha, 10);

        db.collection("users").insert(
            user,
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                deferred.resolve();
            });
    }

    return deferred.promise;
}

function update(_id, userParam) {
    var deferred = Q.defer();

    // validation
    db.collection("users").findById(_id, function (err, user) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (user.login !== userParam.login) {
            // login has changed so check if the new login is already taken
            db.users.findOne(
                { login: userParam.login },
                function (err, user) {
                    if (err) deferred.reject(err.name + ': ' + err.message);

                    if (user) {
                        // login already exists
                        deferred.reject('O login "' + userParam.login + '" já está cadastrado')
                    } else {
                        updateUser();
                    }
                });
        } else {
            updateUser();
        }
    });

    function updateUser() {
        // fields to update
        var set = {            
            login: userParam.login,
            senha: userParam.senha
        };

        // update senha if it was entered
        if (userParam.senha) {
            set.hash = bcrypt.hashSync(userParam.senha, 10);
        }

        db.collection("users").update(
            { _id: mongo.helper.toObjectID(_id) },
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

    db.collection("users").remove(
        { _id: mongo.helper.toObjectID(_id) },
        function (err) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            deferred.resolve();
        });

    return deferred.promise;
}