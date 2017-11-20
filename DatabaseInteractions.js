//File for interacting with the mongo database holding voting information
//TODO: add functionality for finding and creating users
//TODO: Add capability to attach questions to users
var mongo = require("mongodb").MongoClient;
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

//PUT THESE IN A .ENV FILE
var user = process.env.MONGODB_USER;
var pwd = process.env.MONGODB_PASSWORD;
//console.log(user + " " + pwd);


var url = "mongodb://"+user+":"+pwd+"@ds157964.mlab.com:57964/jonbase";
//Defining user schema
var userSchema = new Schema({
  username: String,
  password: String,
  dateOfCreation: {type: Date, default: Date.now}
  
});

//Defining vote schema
var voteSchema = new Schema({
  question: {type: String, required: true},
  options: {type: Array, required: true},
  creator: {type: String, required: true},
  date: {type: Date, default: Date.now},
  open: {type: Boolean, default: true},
  closes: {}
});

//mongoose.useMongoClient();
mongoose.connect(url);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', function(){
  console.log("Connected to database!");

  
});
var User = mongoose.model("user", userSchema, "users");
/*
var users1 = [
  {
    username: "data",
    password: "secret",
    dateOfCreation: new Date(70000)},
  {
    username: "second",
    password: "other",
    dateOfCreation: new Date(6999)
  }
];*/

var Vote = mongoose.model("vote", voteSchema);

//Add an IP list to this so as to allow IP checking
/*
var sampleVote = {
  "question":"Question!!",
  "options":[{q: "this", v: 14}, {q: "that", v: 20}],
  "creator": "data",
  "created": new Date(Date.now()),
  "open": true,
};  */

exports.validateUser = function (/*string*/ name, /*string*/ password, /*function*/ callback) { 
  User.findOne({"username": name}, function(err, user){
    if (err) throw err;
    // If no user found, cannot login --> callback(null).
    if (!user){
      return callback(null);
    } else {
      //If user found, return its information
      if (user.password == password) {
        return callback("auth");
      } else {
        console.log("invalid password");
        return callback("invalid");
      }
    }
  });
    
  //return callback(result);
};
  
// Methods related to VOTE MANIPULATION
//
//
exports.listAllVotes = function (/*string*/ parameter, /*function*/ callback){
    // Getting a list of latest votes
    Vote.find((err, res) => {
      if (err) {return console.log(err);}
      console.log(res);
      return res;
    });
};


exports.listOpenVotes = function ( ) {
//Listing votes that can still be voted on

};

exports.listClosedVotes = function ( ){
// LIsting votes which cannot be altered

}

exports.listOwnVotes = function (/*String*/ username, /*function*/callback){
// List user's self-created votes
  Vote.find({creator: username}, (err, ret) => {
    if (err) {
      console.log(err);
      return callback(null);
    }
    return callback(ret);
  });
}
  
exports.updateVote = function(/*string*/ name, /*integer*/ votedNumber, /*function*/ callback){
  console.log("updateVote: " + name + ", votedNumber: " + votedNumber); 
  //Increment the number that has the same index as the item voted for
  //sampleVote.votes[votedNumber]++;
  return callback(null);
    
};
  
exports.createVote = function (/*String*/ question, /*string array*/ options, /*string*/ username, /*function*/callback){

  console.log(options);
  var ops = [];
  options.forEach((option) => {
    console.log("Adding option: " + option);
    ops.push({q: option, v: 0});
  });

  var vote = new Vote ({
    question: question,
    options: ops,
    creator: username,
    date: new Date(Date.now()),
    open: true
  });

  vote.save((err, vot) => {
    if (err) {return console.log(err);}
    //console.log("Vote created.");
    //console.log(vot);
    return callback(vot);

  });
  /*
  var voteSchema = new Schema({
  question: String,
  options: Array,
  creator: String,
  date: {type: Date, default: Date.now},
  open: {type: Boolean, default: true}
});
  */
  //var voted = [0,0];
  //database.create etc
};
  
exports.deleteVote = function (/*String*/ name, /*function*/ callback){
    //db.find({question: name}, function(err, data){return callback(data);});
    
};

//USER ACCOUNT HANDLES

exports.createUser = function(/*string*/username, /*string*/ password, /*function*/ callback) {
  console.log(username + ", " + password);
  // TODO: Check that username and password fulfill the following criteria:
  // -More than 6 characters

  // Look for existing user with same name; if one exists, refuse request
  User.findOne({"username": username}, function (err, data){
    console.log(data);
    if (err) {
      console.log("error:" + err);
   
    } else {
      console.log("theUser: " + data);
      if (!data) {
        console.log("No such user found – we should be able to create an account!");

        var Us = new User({
          username: username,
          password: password,
          dateOfCreation: Date.now()
        });
        console.log("New user created");      
        //Here we save the user to the database
        Us.save(function(err, Us){
          if (err) {
            return console.error(err);
          } else {
            console.log("New user saved.")
            return callback(Us);
          }
       });
      } else {
        console.log("user exists!");  
        return callback(null);
      }     
    }  
  });
};

exports.getUserInfo = function(/*string*/ username, callback){
  User.findOne({"username":username}, function(err, data){
    if (err) {
      return callback(null);
    } else {
      return callback(data);
    }
  });
};

exports.deleteUser = function(/*username*/ username, callback){
  //Delete user, remember to check for signin and other validation first

};