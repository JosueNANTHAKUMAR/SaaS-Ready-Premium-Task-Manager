let connection = require('../../config/db.js');
const {query} = require("express");
const express = require("express");
const app = express();
const bcrypt = require('bcryptjs');

const authenticateToken = require('./../../middleware/auth.js');

module.exports = function(app) {
    //* View all todos

    app.get("/todos", authenticateToken, (req, res) =>{
        connection.query("SELECT * FROM todo", function (err, results) {
            if (err) throw err;
            if (results.length > 0)
                res.json(results);
            else
                res.json({msg: "Not found"});

        })
    });

    //* View a todo by it id

    app.get("/todos/:id", authenticateToken, (req, res) => {
        connection.query(`SELECT * FROM todo WHERE id = ${req.params.id}`, function (err, results) {
            if (err) throw err;
            if (results.length > 0)
                res.json(results);
            else
                res.json({msg: "Not found"});
        })
    });

    // * add a todo

    app.post("/todos", authenticateToken, (req, res) => {
        let title = req.body.title;
        let description = req.body.description;
        let due_time = req.body.due_time;
        let user_id = req.body.user_id;
        let status = req.body.status;
        let yourDate = new Date()
        let date = yourDate.toISOString().split('T')[0];
        connection.query(`INSERT INTO todo (title, description, created_at, due_time, user_id, status) VALUES( ?, ?, ?, ?, ?, ?)`, [title, description, date, due_time, user_id, status], function (err, results) {
            if (err) throw err;
            connection.query(`SELECT * FROM todo WHERE title = ? AND  created_at = ?`, [title, date], function (err, results) {
                if (err) throw err;
                if (results.length > 0)
                    res.json(results);
                else
                    res.json({msg: "Internal server error"});
            });
        });

    });

    // * update a todo by id

    app.put("/todos/:id", authenticateToken, (req, res) => {
        let title = req.body.title;
        let description = req.body.description;
        let due_time = req.body.due_time;
        let user_id = req.body.user_id;
        let status = req.body.status;
        connection.query(`SELECT * FROM todo where id = ${req.params.id}`, function(error, results, fields) {
            if (title === undefined) {
                title = results[0].title;
            }
            if (description === undefined) {
                description = results[0].description;
            }
            if (due_time === undefined) {
                due_time = results[0].due_time;
            }
            if (user_id === undefined) {
                user_id = results[0].user_id;
            }
            if (status === undefined) {
                status = results[0].status;
            }
            connection.query(`UPDATE todo SET title = ?, description = ?, user_id = ?, due_time = ?, status = ? WHERE id = ${req.params.id}`, [title, description, user_id, due_time, status], function(error, results, fields) {
                if (error) throw error;
                connection.query(`SELECT * FROM todo where id = ${req.params.id}`, function(error, results) {
                    if (error) throw error;
                    if (results.length > 0)
                        res.json({title: results[0].title, description: results[0].description, user_id: results[0].user_id, due_time: results[0].due_time, status: results[0].status});
                    else
                        res.json({msg: "Internal server error"});
                });
            });
        });
    });

    //* Delete a todo

    app.delete("/todos/:id", authenticateToken, (req, res) => {
        connection.query(`DELETE FROM todo WHERE id = ${req.params.id}`, function(error, results, fields) {
            if (error) throw error;
            if (results.length > 0)
                res.json({"msg": `Successfully deleted record number : ${req.params.id}`});
            else
                res.json({msg: "Not found"});
        });
    });
}