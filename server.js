'use strict';

//var http = require('http');
var https = require('https');
var express = require('express');
var bodyParser = require('body-parser');
var dotenv = require('dotenv').config();
var cookie = require('cookie');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var session = require('client-sessions');
//var mongoStore = require('connect-mongo') (session);
//var RedisStore = require('connect-redis')(session);
var db = require('./DatabaseInteractions.js');
var user = db.User;
var vote = db.Vote;

var app = express();
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Setting up session management and session secret
var secret = process.env.APP_SECRET;

app.use(session({
    cookieName: 'session',
    secret: secret,
    duration: 30*60*100,
    activeDuration: 5*60*100
}));

/*
app.use(session({
    cookieName: 'session',
    secret: secret,
    resave: false,
    saveUninitialized: true,
    cookie: {httpOnly: true, secure: true, maxAge: 600000},
    store: new RedisStore()
}));*/

/*
//middleware for session data
app.use(function(req, res, next) {
    if (req.session && req.session.user) {
        User.findOne({ username: req.session.user.username}, function(err, user) {
            if (user) {
                req.user = user;
                delete req.user.password;
                req.session.user = user;
                req.locals.user = user;
            }
            next();

        });
    } else {
        next();
    }
});*/

require("./routes.js") (app);
console.log("Server started.");

app.listen(3000);
