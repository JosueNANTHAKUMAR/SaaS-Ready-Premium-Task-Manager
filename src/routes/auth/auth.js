let connection = require('../../config/db.js');
const {query} = require("express");
const express = require("express");
const app = express();
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs');

function generateAccessToken(id) {
    return jwt.sign(id, process.env.SECRET);
}

//* register a new user
module.exports = function(app) {
    app.post("/register", function(req, res) {
        let email = req.body.email;
        let password = req.body.password;
        let name = req.body.name;
        let firstname = req.body.firstname;
        connection.query("SELECT * FROM user WHERE email = ?", [email], function(error, results, fields) {
            if (error) throw error;
            if (results.length > 0) {
                res.json({msg:  "Account already exists"});
            } else {
                bcrypt.genSalt(10, function (err, Salt) {
                    bcrypt.hash(password, Salt, function (err, hash) {
                        if (err) throw err;
                        connection.query("INSERT INTO user(email, password, name, firstname) VALUES (?, ?, ?, ?)", [email, hash, name, firstname], function(error, results, fields) {
                            if (error) throw error;
                            connection.query("SELECT * FROM user WHERE email = ?", [email], function(error, results, fields) {
                                if (error) throw error;
                                res.json({token: generateAccessToken(results[0].id)});
                            });
                        });
                    });
                });
            }
        });
    });

    //* connect a user

    app.post("/login", (req, res) => {
        let email = req.body.email;
        let password = req.body.password;
        connection.query("SELECT * FROM user WHERE email = ?", [email] , function(error, results, fields) {
            if (error) throw error;
            if (results.length > 0) {
                bcrypt.compare(password, results[0].password, function(err, result) {
                    if (err) throw err;
                    if (result == true)
                        res.json({token: generateAccessToken(results[0].id)});
                    else {
                        res.json({msg: "Invalid Credentials"});
                    }
                });
            } else {
                res.json({msg: "Invalid Credentials"});
            }
        });
    });
}