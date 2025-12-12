let connection = require('../../config/db.js');
const {query} = require("express");
const express = require("express");
const app = express();
const bcrypt = require('bcryptjs');

const authenticateToken = require('./../../middleware/auth.js');

module.exports = function(app) {
    //* view all user informations

    app.get("/user", authenticateToken, (req, res) => {
        connection.query(`SELECT * FROM user`, function(error, results) {
            if (error) throw error;
            if (results.length > 0)
                res.json({results});
            else
                res.json({msg: "Not found"});
        });
    });

    //* view all todos from an user

    app.get("/user/todos", authenticateToken, (req, res) => {
        connection.query(`SELECT * FROM todo where user_id = ${req.id}`, function(error, results, fields) {
            if (error) throw error;
            if (results.length > 0)
                res.json({results});
            else
                res.json({msg: "Not found"});
        });
    });

    //* view all informations from an user with id

    app.get("/users/:id", authenticateToken, (req, res) => { //! avec mail a faire
        connection.query(`SELECT * FROM user where id = ${req.params.id}`, function(error, results, fields) {
            if (error) throw error;
            if (results.length > 0)
                res.json({results});
            else
                res.json({msg: "Not found"});
        });
    });

    //* update informations from an user with id

    app.put("/users/:id", authenticateToken, (req, res) => {
        let password = req.body.password;
        let fname = req.body.firstname;
        let email = req.body.email;
        let name = req.body.name;
        connection.query(`SELECT * FROM user where id = ${req.params.id}`, function(error, results, fields) {
            if (email === undefined) {
                email = results[0].email;
            }
            if (password === undefined) {
                password = results[0].password;
            }
            if (fname === undefined) {
                fname = results[0].firstname;
            }
            if (name === undefined) {
                name = results[0].name;
            }
            bcrypt.genSalt(10, function (err, Salt) {
                bcrypt.hash(password, Salt, function (err, hash) {
                    connection.query(`UPDATE user SET email = ?, password = ?, name = ?, firstname = ? WHERE id = ${req.params.id}`, [email, hash, name, fname], function(error, results, fields) {
                        if (error) throw error;
                    });
                });
            });
            connection.query(`SELECT * FROM user WHERE id = ${req.params.id}`, function(error, results) {
                if (error) throw error;
                if (results.length > 0)
                    res.json(results[0]);
                else
                    res.json({msg: "Internal server error"});
            });
        });
    });

    //* delete informations from an user with id

    app.delete("/users/:id", authenticateToken, (req, res) => {
        connection.query(`DELETE FROM user WHERE id = ${req.params.id}`, function(error, results, fields) {
            if (error) throw error;
            if (results.length > 0)
                res.json({"msg": `Successfully deleted record number : ${req.params.id}`});
            else
                res.json({msg: "Not found"});
        });
    });

}