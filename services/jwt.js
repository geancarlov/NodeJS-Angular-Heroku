
const jwt = require('jsonwebtoken');

exports.createToken = (user) => {
    return jwt.sign({user}, proces.env.SECRET, {expiresIn: '1hr'})
}
