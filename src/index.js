require('dotenv').config()
const express = require('express');
require('./config/database.js');

const users =  require('./routes/users.js');
const transacoes = require('./routes/transacoes.js');

const app = express();

app.use(express.json());
app.use('/api', users);
app.use('/api', transacoes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`http:localhost:${port}`);
});

module.exports = app;