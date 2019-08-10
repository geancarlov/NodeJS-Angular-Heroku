const bcrypt = require('bcrypt');
const saltRounds = 10;
const { user } = require('../models/user');
const jwt = require('../services/jwt');


exports.login = (req, res) => {
    let params = req.body;
    if (params.email && params.password) {
        user.findOne({ email: params.email }).exec((err, user) => {
            if (err) {
                res.status(500).send('Ocurrio un Error', err);
            }
            if (user) {
                bcrypt.compare(params.password, user.password, (err, response) => {
                    if (response) {
                        user.password = ':(';
                        res.status(200).json({ 
                            status: 'Ok', 
                            data: user,
                            token: jwt.createToken(user)
                        })
                    } else {
                        res.status(404).json({
                            status: 'err',
                            message: `Usuario y/o contraseña incorrectos`
                        });
                    }
                })
            } else {
                res.status(404).json({
                    status: 'err',
                    mensaje: `El usuario no está registrado`
                });
            }
        })
    } else {
        res.status(404).send("No has enviado ningun dato");
    }
}

exports.register = (req, res) => {
    let params = req.body;
    if (params.email && params.password && params.name) {
        user.findOne({ email: params.email }, (err, respuesta) => {
            if (err) {
                res.status(500).json({ message: 'Ocurrio un Error' });
            } else if (respuesta !== null) {
                res.status(200).json({ message: `El correo ${params.email} ya esta en uso` });
            } else {
                bcrypt.genSalt(saltRounds, function (err, salt) {
                    bcrypt.hash(params.password, salt, function (err, hash) {
                        let newUser = user({
                            name: params.name,
                            email: params.email,
                            password: hash
                        });
                        newUser.save((err, resp) => {
                            if (err) {
                                res.status(500).json({ message: 'Ocurrio un error', err });
                            } if (resp) {
                                newUser.password = ':('
                                res.status(201).json({ status: 'Ok', data: resp });
                            } else {
                                res.status(400).json({ message: 'No se creo el usuario' });
                            }
                        });
                    });
                });
            }
        })


    } else {
        res.status(400).json({ message: 'Sin datos' })
    }

}