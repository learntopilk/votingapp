//import { request } from 'https';

var db = require('./DatabaseInteractions.js');
var mongoose = require("mongoose");
var bodyParser = require('body-parser');
var cookies = require("cookies");
var cookieParser = require("cookie-parser");
var session = require('client-sessions');




function requireLogin(req, res, next) {
  if (!req.userCookie.user) {
    console.log("No user session detected");
    res.redirect("/login");
  } else {
    console.log("User detected: " + req.userCookie.user);
    //console.log(req.userCookie.user);
    //console.log(req.userCookie.username);
    next();
  }
}
module.exports = function(app) {
  
  //Basic file serving / initialization. 
  //TODO: send something else or add a thing when signed in.
  app.get("/vote", function (req, res){
    //TODO: Make this page the page you use to see a single vote's information
    res.sendFile(__dirname + "/views/index.html");
    console.log("index.html served");
  });

  //Endpoint for getting information from the database.
  //TODO: add literally all database functions.
  app.get("/info", function (req, res) {
    console.log("Info requested.");
    /*db.validateUser("latest", function(r){
        res.send(JSON.stringify(r));
      });*/
  });

  //FOR VOTING
  app.post("/vote", function(req, res) {
    
    //TODO: implement IP address checking to disallow voting by the same person twice
    console.log("Registering vote");
    //console.log(req.body[0]);
  
    if(req.body.length > 0) {
      db.updateVote(req.body[0].name, req.body[0].value - 1, function(updatedVoteInfo){
        console.log(updatedVoteInfo);
        res.send(JSON.stringify(updatedVoteInfo));
      });
    }
  });

  //FOR CREATING VOTES
  app.put("/vote", requireLogin, (req, res) => {
    console.log("Creating question");
    let bod = req.body;
    //console.log(bod.options);
    let ops = [];

    for (let i = 0; i < bod.options.length; i++) {
      console.log(bod.options[i].value);
      ops.push(bod.options[i].value);
    }

    
    db.createVote(bod.question, ops, req.userCookie.user, (ret) => {
      console.log('db.createVote returned: ' + ret);
      if (typeof(ret != {})) {
        
      }

    });
  });

  app.get("/uservotes", requireLogin, (req, res) => {
    console.log("user votes requested");
    db.listOwnVotes(req.userCookie.user, (data) => {
      if (!data) {
        res.send({error: "Database error!"});
      } else {
        res.send(JSON.stringify(data));
      }
    });

  });

  app.get("/createVote", requireLogin, (req, res) => {
    res.sendFile(__dirname + "/public/createVote.html")
  });

  app.get("/createVote.js", requireLogin, (req, res) => {
    res.sendFile(__dirname + "/public/createVote.js")
  });





 //___________________________________________________________________________________________________________________________
 //___________________________________________________________________________________________________________________________
 //___________________________________________________________________________________________________________________________
 





 
 //Serving the signup page (or form?)

 app.get("/signup", function(req, res){
    // if(userIsSignedIn){res.redirect(profile page)}
    res.sendFile(__dirname + "/public/signup.html");
  });
  
  //Endpoint for logging in
  app.put("/signup", function(req, res){
    console.log("signup request");
    console.log(req.body);
    console.log(req.cookies);
    db.createUser(req.body.username, req.body.password, function(data){
      // if data == null, there was no user. if anything else is returned, it's the user info.
      if (data == null) {
        res.responseInfo = {created: "false", reason: "Username already in use!"};
        //res.send({created: "false", reason: "Username already in use!"});
        res.send();
      } else {
        //cookies.
        console.log("signin cookie setup stage initiated.");
        res.responseInfo = {created: "true"};
        res.cookie("TestCookie1", 'TestValue1', {maxAge: 90000, httpOnly: true});
        //res.redirect("/profile");
        
        //TODO: Implementoi automaattinen login, lähetä jokin salainen avain?
      }
      
    });
    //res.cookie("TestCookie2", "TestValue2", {maxAge: 9000, httpOnly: true}).send("data received");
    
  });

  app.get("/test", function(req, res){
    db.createUser("testi2", "salainen", function(data){
      // If createuser gives null, there exists a user by the name and registration cannot be done.
      if (!data) {
        res.cookie("signedIn", false, {expires: new Date(0), httpOnly: true});
        res.send("User already exists!");
      } else {
        // TODO: create automatic sign-in at signup
        res.cookie("TestCookie1", data[0], {maxAge: 90000, httpOnly: true}).send(data);
      }
    });
  });

  app.get("/votetest", (req, res) => {
    db.createVote("Who is the president of China?", ["hu", "who", "Hue"], "get", (re) => {
      if (!re) {
        res.send("Unable to create vote!");
      } else {
        //implement
        //res.redirect("/vote/<id or name of this vote>"); 
        res.send(re);
      }
    });
  });





 //___________________________________________________________________________________________________________________________
 //___________________________________________________________________________________________________________________________
 //___________________________________________________________________________________________________________________________





  
  //Endpoint for logout
  app.post("/logout", function(req, res){
    res.cookie("signedIn", false, {expires: new Date(0), httpOnly: true});
    delete req.userCookie.user;
    req.session.reset();
    res.redirect("/login");
    //Implement other measures to keep user away from
  });
  app.get("/logout", function(req, res){
    res.cookie("signedIn", false, {expires: new Date(0), httpOnly: true});
    delete req.userCookie.user;
    //req.session.reset();
    res.redirect("/login");
    //Implement other measures to keep user away from
  });
  
  //Serving the login form
  app.get("/login", function(req, res){
    res.sendFile(__dirname + "/public/login.html");
  });

  app.get("/login.js", function(req, res){
    res.sendFile(__dirname + "/public/login.js");
  });
  
  //for creating a new user
  app.post("/login", function(req, res){
    console.log("Login attempt:" + req.body);
    console.log(Object.keys(req.body));
    db.validateUser(req.body.username, req.body.password, function(user){
      switch (user) {
        case null:
          console.log("No such username!");
          res.send("<h2>Invalid username!</h2>");
          break;
        case "invalid":
          res.send("<h2>Invalid password!</h2>");
          break;
        case "auth":
          console.log("Authenticated");
          req.userCookie.user = req.body.username;
          res.redirect('/profile');
          break;
      };
    });
    /*if (db.userFound(req.credentials)) {
      res.cookie('cookieName', 'cookieValue', {maxAge: 90, httpOnly: true});
    }*/
  });
  
  //Profile: view the questions this profile has created, as well as the results of the vote
  app.get("/profile", requireLogin, function(req, res){
    //
    console.log(req.userCookie);
    db.listOwnVotes(req.userCookie.user, (ret) => {
      if (!ret) {
        res.send("Something went wrong!");
      } else {
        console.log(ret);
        //res.send(ret);
        res.sendFile(__dirname + "/public/profile.html");
      }
    });
    //res.send("you are currently observing the profile page.");
  }); 

  app.get("/profile.js", requireLogin, (req, res) => {
    res.sendFile(__dirname + "/public/profile.js");


  });
  







 //___________________________________________________________________________________________________________________________
 //___________________________________________________________________________________________________________________________
 //___________________________________________________________________________________________________________________________













  //These are halfway ready, stay away from them for now
  app.get("/createVote.js", function(req, res){
    res.sendFile(__dirname + "/public/createVote.js");
  });
  app.get("/client.js", function(req, res){
    res.sendFile(__dirname + "/public/client.js");
  });
  app.get("/style.css", function(req, res){
    console.log("css sent.");
    res.sendFile(__dirname + "/public/style.css");
  });
  app.get("/signup.js", function(req, res){
    res.sendFile(__dirname + "/public/signup.js");
  });
  app.get("/*" , function(req, res){

    //console.log("Logging potential cookies:");
    //console.log(req.user + ", " + req.cookies);
    res.sendFile(__dirname + "/views/index.html");
    console.log("Default response served.");

    //testi
    /*db.getUserInfo("testi", function(data){
      if (!data) {
        console.log("No test data found.");
      } else {
        console.log("Test data:" + data);
      }
    });*/
  });
}