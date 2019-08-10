
//require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const verify = require('./middlewares/verifyToken');

const app = express();
const PORT = process.env.PORT;

mongoose.connect(process.env.mongoUrl, { useNewUrlParser: true }, (err) => {
    if (!err) {
        console.log('Mongo conectado correctamente por parte de Gean');
    }
});

const {login, register}  = require('./controllers/auth');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('<h1>Server</h1>');
})

app.post('/new/user', verify.verifyTkn, register);
app.post('/login', login);


app.listen(PORT, () => {
    console.log(`Servidor Escuchando en port ${PORT}`);
})

