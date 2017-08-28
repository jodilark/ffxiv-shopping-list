const express = require('express')
const session = require('express-session')
const bodyParser = require('body-parser')
const config = require('../config')
const port = 8080
const app = express()
app.use(express.static('./'))
app.use(bodyParser.json())
app.use(session({resave: true, saveUninitialized: true, secret: config.sessionSecret}));

//db and node echo
app.listen(port, _ => console.log(`listening on port ${port}`))