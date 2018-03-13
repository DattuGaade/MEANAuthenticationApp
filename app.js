const express = require('express');
const path = require('path');//no need install this. It is a core module
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config/database');
const users = require('./routes/users')

// Connect to Database
mongoose.connect(config.database);

// On Connection Success
mongoose.connection.on('connected',() => {
  console.log('Connected to database : '+config.database);
});

// On Connection Failure
mongoose.connection.on('error',(err) => {
  console.log('Database Error : '+err);
});

const app = express();

// Port number
const port = 3000;// Use while developing application
//const port = process.env.PORT || 8080;// Use this while deploying application to some server

// CORS Middleware
app.use(cors());

// Set Static Folder
app.use(express.static(path.join(__dirname,'public')));

// Body parser Middleware
app.use(bodyParser.json());

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

// Uses routes specified in ./routes/users.js file
app.use('/users',users);

// Index route
app.get('/',(req,res) => {
  res.send('Hello World');
});

// Every Other route
app.get('*', (req, res) => {
  res.redirect('/');
});
// Start server
app.listen(port, () => {
  console.log('Server started on port :'+port);
});
