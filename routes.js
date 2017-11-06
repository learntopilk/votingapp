var db = require('./DatabaseInteractions.js');
var mongoose = require("mongoose");
var bodyParser = require('body-parser');
var cookies = require("cookies");
var cookieParser = require("cookie-parser");
var session = require('client-sessions');




function requireLogin(req, res, next) {
  if (!req.user) {
    res.redirect("/login");
  } else {
    next();
  }
}
module.exports = function(app) {
  
/*
//This is a test cookie setter
app.get("/", function(request, response, next){
  if (!request.cookies) {
    console.log("setting cookies");
    response.cookie("cookie_name", "value", {httpOnly: false});
  } else {
    console.log("Some cookies found...");
    response.cookie("cookie_name", "value", {httpOnly: true});
  }

  next();
});  */


  //Basic file serving / initialization. 
  //TODO: send something else or add a thing when signed in.
  app.get("/vote", function (request, response){
    response.sendFile(__dirname + "/views/index.html");
    console.log("index.html served");
  });

  //Endpoint for getting information from the database.
  //TODO: add literally all database functions.
  app.get("/info", function (request, response) {
    console.log("Info requested.");
    db.getSingle("latest", function(r){
        response.send(JSON.stringify(r));
      });
  });

  //FOR VOTING
  app.post("/vote", function(request, response) {
    
    //TODO: implement IP address checking to disallow voting by the same person twice
    console.log("Registering vote");
    //console.log(request.body[0]);
  
    if(request.body.length > 0) {
      db.updateVote(request.body[0].name, request.body[0].value - 1, function(updatedVoteInfo){
        console.log(updatedVoteInfo);
        response.send(JSON.stringify(updatedVoteInfo));
      });
    }
  });

  //FOR CREATING VOTES
  app.put("/vote", requireLogin, function (request, response) {
    //TODO: Check for sign-in
    //if (request.user is signed in)
    console.log("Creating question");
  });

 
  //Serving the signup page (or form?)
  app.get("/signup", function(request, response){
    // if(userIsSignedIn){response.redirect(profile page)}
    response.sendFile(__dirname + "/public/signup.html");
  });
  
  //Endpoint for logging in
  app.put("/signup", function(request, response){
    console.log("signup request");
    console.log(request.body);
    console.log(request.cookies);
    db.createUser(request.body.username, request.body.password, function(data){
      // if data == null, there was no user. if anything else is returned, it's the user info.
      if (data == null) {
        response.responseInfo = {created: "false", reason: "Username already in use!"};
        //response.send({created: "false", reason: "Username already in use!"});
        response.send();
      } else {
        //cookies.
        console.log("signin cookie setup stage initiated.");
        response.responseInfo = {created: "true"};
        response.cookie("TestCookie1", 'TestValue1', {maxAge: 90000, httpOnly: true});
        //response.redirect("/profile");
        
        //TODO: Implementoi automaattinen login, lähetä jokin salainen avain?
      }
      
    });
    //response.cookie("TestCookie2", "TestValue2", {maxAge: 9000, httpOnly: true}).send("data received");
    
  });

  app.get("/test", function(request, response){
    db.createUser("testi2", "salainen", function(data){
      if (!data) {
        response.cookie("signedIn", false, {expires: new Date(0), httpOnly: true});
        response.send("User already exists!");
      } else {
        response.cookie("TestCookie1", data[0], {maxAge: 90000, httpOnly: true}).send(data);
      }
    });


  });

  
  //Endpoint for logout
  app.post("/logout", function(request, response){
    response.cookie("signedIn", false, {expires: new Date(0), httpOnly: true});
    request.session.reset();
    response.redirect("/vote");
    //Implement other measures to keep user away from
  });
  
  //Serving the login form
  app.get("/login", function(request, response){
    response.sendFile(__dirname + "/public/login.html");
  });
  app.get("/login.js", function(request, response){
    response.sendFile(__dirname + "/public/login.js");
  });
  
  //for creating a new user
  app.post("/login", function(request, response){
    console.log("Login attempt:" + request.body);
    console.log(Object.keys(request.body));



    /*if (db.userFound(request.credentials)) {
      res.cookie('cookieName', 'cookieValue', {maxAge: 90, httpOnly: true});
    }*/
  });
  
  //Profile: view the questions this profile has created, as well as the results of the vote
  app.get("/profile", requireLogin, function(request, response){
    //
  }); 
  
  //These are halfway ready, stay away from them for now
  app.get("/client.js", function(request, response){
    response.sendFile(__dirname + "/public/client.js");
  });
  app.get("/client.css", function(request, response){
    response.sendFile(__dirname + "/public/client.css");
  });
  app.get("/signup.js", function(request, response){
    response.sendFile(__dirname + "/public/signup.js");
  });
  app.get("/*" , function(request, response){

    //console.log("Logging potential cookies:");
    console.log(request.cookies);
    response.sendFile(__dirname + "/views/index.html");
    console.log("Default response served.");

    //testi
    db.getUserInfo("testi", function(data){
      if (!data) {
        console.log("No test data found.");
      } else {
        console.log("Test data:" + data);
      }


    });
  });
}