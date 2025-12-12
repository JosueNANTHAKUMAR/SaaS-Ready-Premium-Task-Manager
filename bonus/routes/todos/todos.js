let connection = require('../../config/db.js');
const {query} = require("express");
const express = require("express");
const app = express();
const bcrypt = require('bcryptjs');
const authenticateToken = require('../../middleware/auth.js');

module.exports = function(app) {
    // * add a todo

}