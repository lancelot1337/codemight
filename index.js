const express = require(`express`),
    app = express(),
    mysql = require(`mysql`),
    bodyParser = require(`body-parser`),
    morgan = require(`morgan`),
    ejsLint = require('ejs-lint'),
    ejs = require('ejs'),
    path = require('path')

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
        console.log(err)
    }
    console.log('Database Connected!')
})

// For logging
app.use(morgan('dev'))

//for bodyParser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')

    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET')
        return res.status(200).json({})
    }
    next()
})

app.use(express.static('public'));

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.get('/lint', (req, res, next) => {
    console.log(ejsLint(`blog.ejs`))
})
app.get('/', (req, res, next) => {
    res.render('index.ejs')
})

app.get('/home', (req, res, next) => {
    res.redirect('/')
})

app.get('/index', (req, res, next) => {
    res.redirect('/')
})

app.get('/users', (req, res, next) => {
    let sql = `select users.id as userid, users.name as username, users.userimage as uimage, institutes.id as instituteid, institutes.name as institutename, institutes.address as address from users join institutes on (users.institute_id = institutes.id)`
    db.query(sql, (err, result) => {
        if (err) console.log(err)
        console.log(result)
        res.render('users.ejs', { result: result })
    })
})

app.get('/newuser', (req, res, next) => {
    res.render(`userform.ejs`)
})

app.post('/newuser', (req, res, next) => {
    console.log(`req.body`)
    console.log(req.body)
    let sql = `insert into users (name, institute_id, userimage) values ("${req.body.name}", "${req.body.instituteid}", "${req.body.imglink}")`
    db.query(sql, (err, result) => {
        if (err) console.log(err)
        console.log(result)
        res.render('userform.ejs')
    })
})

app.get('/institutes', (req, res, next) => {
    let sql = `select * from institutes`
    db.query(sql, (err, result) => {
        if (err) console.log(err)
        console.log(result)
        res.render('institutes.ejs', { result: result })
    })
})

app.get('/newinstitute', (req, res, next) => {
    res.render(`instituteform.ejs`)
})

app.post('/newinstitute', (req, res, next) => {
    console.log(`req.body`)
    console.log(req.body)
    let sql = `insert into institutes (name, address, image) values ("${req.body.name}", "${req.body.address}", "${req.body.imglink}")`
    db.query(sql, (err, result) => {
        if (err) console.log(err)
        console.log(result)
        res.render('instituteform.ejs')
    })
})

app.get('/questions', (req, res, next) => {
    let sql = `select users.name as authorname, questions.title, questions.description, questions.score, questions.qimage from users join questions on users.id = questions.author_id;
    `
    db.query(sql, (err, result) => {
        if (err) console.log(err)
        console.log(result)
        res.render('questions.ejs', { result: result })
    })
})

app.get('/newquestion', (req, res, next) => {
    res.render(`questionform.ejs`)
})

app.post('/newquestion', (req, res, next) => {
    console.log(`req.body`)
    console.log(req.body)
    let sql = `insert into questions (title, description, author_id, score, contest_id, qimage) values ("${req.body.title}", "${req.body.description}", "${req.body.authorid}", "${req.body.score}", "${req.body.contestid}", "${req.body.imglink}")`
    db.query(sql, (err, result) => {
        if (err) console.log(err)
        console.log(result)
        res.render('questionform.ejs')
    })
})

app.get('/contests', (req, res, next) => {
    let sql = `select * from contests`
    db.query(sql, (err, result) => {
        if (err) console.log(err)
        console.log(result)
        res.render('contests.ejs', { result: result })
    })
})

app.get('/newcontest', (req, res, next) => {
    res.render(`contestform.ejs`)
})

app.post('/newcontest', (req, res, next) => {
    console.log(`req.body`)
    console.log(req.body)
    let sql = `insert into contests (name, description, startsat, endsat, cimage) values ("${req.body.name}", "${req.body.description}", "${req.body.startsat}", "${req.body.endsat}", "${req.body.imglink}")`
    db.query(sql, (err, result) => {
        if (err) console.log(err)
        console.log(result)
        res.render('contestform.ejs')
    })
})

app.get('/progress', (req, res, next) => {
    let sql = `select users.name as name, temp.sum from users left join (select usersquestions.user_id as uid, sum(questions.score) as sum from usersquestions join questions on usersquestions.question_id = questions.id group by uid order by sum desc) as temp on users.id = temp.uid order by temp.sum desc;`
    db.query(sql, (err, result) => {
        if (err) console.log(err)
        console.log(result)
        res.render('progress.ejs', { result: result })
    })
})

app.get('/solvequestion', (req, res, next) => {
    res.render(`progressform.ejs`)
})

app.post('/solvequestion', (req, res, next) => {
    console.log(`req.body`)
    console.log(req.body)
    let sql = `insert into usersquestions (user_id, question_id) values ("${req.body.id1}", "${req.body.id2}")`
    db.query(sql, (err, result) => {
        if (err) console.log(err)
        console.log(result)
        res.render('progressform.ejs')
    })
})

// Create DB
app.get('/createdb', (req, res) => {
    let sql = 'CREATE DATABASE codemight'
    db.query(sql, (err, result) => {
        if (err) console.log(err)
        console.log(result)
        res.send('Database created!')
    })
})

// Create institutes table
app.get('/createinstitutes', (req, res) => {
    let sql = 'CREATE TABLE institutes(id int AUTO_INCREMENT, name VARCHAR(255), address VARCHAR(255), image text, PRIMARY KEY(id))'
    db.query(sql, (err, result) => {
        if (err) console.log(err)
        console.log(result)
        res.send('Institutes table created!')
    })
})

// Create contests table
app.get('/createcontests', (req, res) => {
    let sql = 'CREATE TABLE contests(id int AUTO_INCREMENT, name VARCHAR(255), description longtext, startsat datetime, endsat datetime, cimage text, PRIMARY KEY(id))'
    db.query(sql, (err, result) => {
        if (err) console.log(err)
        console.log(result)
        res.send('Contests table created!')
    })
})

// Create questions table
app.get('/createquestions', (req, res) => {
    let sql = 'CREATE TABLE questions(id int AUTO_INCREMENT, title VARCHAR(255), description longtext, author_id int, score int, contest_id int, qimage text, PRIMARY KEY(id))'
    db.query(sql, (err, result) => {
        if (err) console.log(err)
        console.log(result)
        res.send('Questions table created!')
    })
})

// Create users table
app.get('/createusers', (req, res) => {
    let sql = 'CREATE TABLE users(id int AUTO_INCREMENT, name VARCHAR(255), institute_id int, userimage text, PRIMARY KEY(id))'
    db.query(sql, (err, result) => {
        if (err) console.log(err)
        console.log(result)
        res.send('Users table created!')
    })
})

// Create users-questions table
app.get('/createusersquestions', (req, res) => {
    let sql = 'CREATE TABLE usersquestions(user_id int, question_id int)'
    db.query(sql, (err, result) => {
        if (err) console.log(err)
        console.log(result)
        res.send('Users-Questions table created!')
    })
})

module.exports = app