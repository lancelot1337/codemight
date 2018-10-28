const express = require(`express`),
    app = express(),
    mysql = require(`mysql`),
    bodyParser = require(`body-parser`),
    morgan = require(`morgan`)

//for logging
app.use(morgan('dev'))

module.exports = app