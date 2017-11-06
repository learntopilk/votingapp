'use strict';

//var http = require('http');
var https = require('https');
var express = require('express');
//var db = require('./DatabaseInteractions.js');
var bodyParser = require('body-parser');
var dotenv = require('dotenv').config();
var cookie = require('cookie');
var cookieParser = require('cookie-parser');
//var routes = require('./routes.js');
var session = require('client-sessions');
var user = require('./DatabaseInteractions.js').User;

var app = express();
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({
    cookieName: 'session',
    secret: 'this_is a very secure sea-crit string of many varieties',
    duration: 4 * 60 * 1000,
    activeDuration: 2 * 60 * 1000
}));

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
});

require("./routes.js") (app);
console.log("Server started.");

app.listen(3000);
