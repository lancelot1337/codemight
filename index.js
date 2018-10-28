const express = require(`express`),
    app = express(),
    mysql = require(`mysql`),
    bodyParser = require(`body-parser`),
    morgan = require(`morgan`)

// Create connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'codemight'
})

// Connect DB
db.connect((err) => {
    if (err) {
        throw err
    }
    console.log('Database Connected!')
})

// For logging
app.use(morgan('dev'))

// Create DB
app.get('/createdb', (req, res) => {
    let sql = 'CREATE DATABASE codemight'
    db.query(sql, (err, result) => {
        if (err) throw err
        console.log(result)
        res.send('Database created!')
    })
})

// Create institutes table
app.get('/createinstitutes', (req, res) => {
    let sql = 'CREATE TABLE institutes(id int AUTO_INCREMENT, name VARCHAR(255), address VARCHAR(255), PRIMARY KEY(id))'
    db.query(sql, (err, result) => {
        if (err) throw err
        console.log(result)
        res.send('Institutes table created!')
    })
})

// Create contests table
app.get('/createcontests', (req, res) => {
    let sql = 'CREATE TABLE contests(id int AUTO_INCREMENT, name VARCHAR(255), description VARCHAR(255), statsat datetime, endsat datetime, PRIMARY KEY(id))'
    db.query(sql, (err, result) => {
        if (err) throw err
        console.log(result)
        res.send('Contests table created!')
    })
})

// Create questions table
app.get('/createquestions', (req, res) => {
    let sql = 'CREATE TABLE questions(id int AUTO_INCREMENT, title VARCHAR(255), description VARCHAR(255), author_id int, score int, contest_id int, PRIMARY KEY(id))'
    db.query(sql, (err, result) => {
        if (err) throw err
        console.log(result)
        res.send('Questions table created!')
    })
})

// Create table
app.get('/createusers', (req, res) => {
    let sql = 'CREATE TABLE users(id int AUTO_INCREMENT, name VARCHAR(255), institute_id int, PRIMARY KEY(id))'
    db.query(sql, (err, result) => {
        if (err) throw err
        console.log(result)
        res.send('Users table created!')
    })
})

// Create table
app.get('/createusersquestions', (req, res) => {
    let sql = 'CREATE TABLE usersquestions(user_id int, question_id)'
    db.query(sql, (err, result) => {
        if (err) throw err
        console.log(result)
        res.send('Users-Questions table created!')
    })
})

module.exports = app