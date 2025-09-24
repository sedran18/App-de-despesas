require('dotenv').config()
const express = require('express');
require('./config/database.js');

const users =  require('./routes/users.js');

const app = express();

app.use(express.json());
app.use('/api', users);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`http:localhost:${port}`);
})