
const jwt = require('jsonwebtoken');

exports.verifyTkn = (req, res, next) => {
    let token = req.headers.authorization;
    if(token) {
        jwt.verify(token, process.env.SECRET, (err, decode) => {
            if(err) {
                res.status(500).json({message: 'Ocurrio un error', err})
            } else{
                console.log('Decoded ==>>> ', decode)
                next();
            }
        })
    } else {
        res.status(403).json({message: 'Sin token'})
    }
}