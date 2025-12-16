const {query} = require("express");
const express = require("express");
let connection = require('./config/db.js');
const app = express();
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs');

require('dotenv').config()
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));



app.use(express.urlencoded({ extended: false}));
app.use(express.json());

const port = process.env.PORT;

app.get('/', function(req, res) {
    res.render('pages/index.ejs');
});



app.post('/register', function(req, res) {
    res.render('pages/inscription.ejs');
});

app.post('/log', function(req, res) {
    res.render('pages/index.ejs');
});

require('./routes/auth/auth.js')(app);
require('./routes/user/user.js')(app);
require('./routes/todos/todos.js')(app);

app.listen(port, () => {
    console.log (`App listening at http://localhost:${port}`);
});
