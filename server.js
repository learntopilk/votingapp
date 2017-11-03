'use strict';

//var http = require('http');
var https = require('https');
var express = require('express');
//var db = require('./DatabaseInteractions.js');
var bodyParser = require('body-parser');
//var routes = require('./routes.js');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//var routes = require("./routes.js");
require("./routes.js") (app);

app.listen(3000);

