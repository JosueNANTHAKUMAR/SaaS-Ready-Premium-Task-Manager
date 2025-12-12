const {query} = require("express");
const express = require("express");
let connection = require('./config/db.js');
const app = express();
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs');

require('dotenv').config()
app.set('view engine', 'ejs');
const authenticateToken = require('./middleware/auth.js');

app.use('/assets', express.static('public'));
app.use(express.urlencoded({ extended: false}));
app.use(express.json());

const port = process.env.PORT;

app.get("/", (req, res) => {
    res.send("Hello World !");
});

require('./routes/auth/auth.js')(app);
require('./routes/user/user.js')(app);
require('./routes/todos/todos.js')(app);

app.listen(port, () => {
    console.log (`App listening at http://localhost:${port}`);
});
