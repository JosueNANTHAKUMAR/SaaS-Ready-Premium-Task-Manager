let connection = require('../../config/db.js');
const {query} = require("express");
const express = require("express");
const app = express();
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs');
let my_id = 0;

//* register a new user
module.exports = function(app) {
    app.post("/sign_in", function(req, res) {
        let email = req.body.Mail;
        let password = req.body.Password;
        let name = req.body.Name;
        let firstname = req.body.Fname;
        connection.query("SELECT * FROM user WHERE email = ?", [email], function(error, results, fields) {
            if (error) throw error;
            if (results.length > 0) {
                res.render('pages/inscription.ejs', { err_msg: "Account already exists !"} );
            } else {
                bcrypt.genSalt(10, function (err, Salt) {
                    bcrypt.hash(password, Salt, function (err, hash) {
                        connection.query("INSERT INTO user(email, password, name, firstname) VALUES (?, ?, ?, ?)", [email, hash, name, firstname], function(error, results, fields) {
                            if (error) throw error;
                            connection.query("SELECT * FROM user WHERE email = ?", [email], function(error, results, fields) {
                                if (error) throw error;
                                my_id = results[0].id;
                                res.render("pages/trello.ejs");
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
        connection.query("SELECT * FROM user WHERE email = ?", [email] , function(error, results12, fields) {
            if (error) throw error;
            console.log(results12);
            if (results12.length > 0) {
                my_id = results12[0].id;
                bcrypt.compare(password, results12[0].password, function(err, result) {
                    if (err) throw err;
                    if (result == true)
                    connection.query(`SELECT * FROM todo`, function (err, results) {
                        if (err) throw err;
                        connection.query('SELECT * FROM todo', function(error, results) {
                            if (error) throw error;
                                // res.render(`pages/trello/${results12[0].id}`, {results: results, number: results.length, error: false});
                            res.redirect(`/start/${results12[0].id}`);
                        });
                    });
                    else {
                        res.render('pages/index.ejs', { err_msg: "Invalid Credentials"} );
                    }
                });
            } else {
                res.render('pages/index.ejs', { err_msg: "Invalid Credentials"} );
            }
        });
    });

    app.get("/start/:id", function (req, res) {
        console.log("my_id = ", my_id);
        connection.query(`SELECT * FROM todo WHERE user_id = ?`, [my_id], function(error, results) {
            if (error) throw error;
            res.render(`pages/trello`, {results: results, number: results.length, error: false});
        });
    });


    app.post("/todos_created", (req, res) => {
        let title = req.body.Title;
        let description = req.body.Description;
        let due_time = req.body.Fin;
        let status = req.body.Status;
        let yourDate = new Date()
        let date = yourDate.toISOString().split('T')[0];
        console.log("ID", my_id);
        connection.query(`INSERT INTO todo (title, description, created_at, due_time, user_id, status) VALUES( ?, ?, ?, ?, ?, ?)`, [title, description, date, due_time, my_id, status], function (err, results) {
            if (err) throw err;
            connection.query(`SELECT * FROM todo`, function (err, results) {
                if (err) throw err;
                res.render("pages/trello.ejs", {results: results});
            });
        });

    });

    // * update a todo by id

    app.post("/set_status", (req, res) => {
        let title = req.body.Title;
        let status = req.body.status;
        connection.query(`UPDATE todo SET status = ? WHERE title = ? AND user_id = ?`, [status, title, my_id], function(error, results, fields) {
            if (error) throw error;
            connection.query(`SELECT * FROM todo`, function(error, results, fields) {
                if (error) throw error;
                res.render("pages/trello.ejs", {results: results});
            });
        });
    });
}