var db = require('./DatabaseInteractions.js');
var mongoose = require("mongoose");
var bodyParser = require('body-parser');
var cookies = require("cookies");
var cookieParser = require("cookie-parser");
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
  app.get("/vote", function (request, response)
  {
    response.sendFile(__dirname + "/views/index.html");
    console.log("index.html served");
  });

  //Endpoint for getting information from the database.
  //TODO: add literally all database functions.
  app.get("/info", function (request, response) 
  {
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
  app.put("/vote", function (request, response) {
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
    db.createUser(request.body.username, request.body.password, function(responseCode, data){
      //0 = found and not created, 1 = not found, success!, 2 = not created for some other reason
      if (responseCode == 0) {
        response.send({created: "false", reason: responseCode});
      } else if (responseCode == 1) {
        //cookies.
        response.cookie("TestCookie1", 'TestValue1', {maxAge: 9000, httpOnly: true});
        response.send({created: "true"});
        //TODO: Implementoi automaattinen login, lähetä jokin salainen avain?
      }
      
      
    });
    response.cookie("TestCookie2", "TestValue2", {maxAge: 9000, httpOnly: true}).send("data received");
    
  });
  
  //Endpoint for logout
  app.post("/logout", function(request, response){
    response.cookie("signedIn", false, {expires: new Date(0), httpOnly: true});
    response.redirect("/vote");
    //Implement other measures to keep user away from
  });
  
  //Serving the login form
  app.get("/login", function(request, response){
    
  });
  
  //for creating a new user
  app.post("/login", function(request, response){
    /*if (db.userFound(request.credentials)) {
      res.cookie('cookieName', 'cookieValue', {maxAge: 90, httpOnly: true});
    }*/
  });
  
  //Profile: view the questions this profile has created, as well as the results of the vote
  app.get("/profile", function(request, response){
    //if(!userIsSignedIn) {response.redirect("/login");}
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

    console.log("Logging potential cookies:");
    console.log(request.cookies);
    response.sendFile(__dirname + "/views/index.html");
    console.log("Default response served.");
  });
}