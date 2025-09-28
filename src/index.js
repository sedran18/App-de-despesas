require('dotenv').config()
const express = require('express');
const conectarAoBancoDEDados = require('./config/database.js');//comente aqui para testar
conectarAoBancoDEDados(); //comente aqui para testar
const users =  require('./routes/users.js');
const transacoes = require('./routes/transacoes.js');

const app = express();

app.use(express.json());
app.use('/api', users);
app.use('/api', transacoes);

app.get('/', (req, res) => {
  res.send('🚀 API de Controle de Despesas está rodando!');
});

const port = process.env.PORT || 3000;
app.listen(port, () => { //comente aqui para testar
    console.log(`http:localhost:${port}`); //comente aqui para testar
});//comente aqui para testar

module.exports = app;