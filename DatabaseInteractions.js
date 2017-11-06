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

//Defining vote schema
var voteSchema = new Schema({
  question: String,
  options: Array,
  creator: String,
  date: {type: Date, default: Date.now},
  open: {type: Boolean, default: true},
  votes: Array
  
});
var vote = mongoose.model("vote", voteSchema);

//Add an IP list to this so as to allow IP checking
var sampleVote = {
  "question":"Question!!",
  "options":["this", "that"],
  "creator": "data",
  "open": true,
  "votes" :[20, 13]
};

  
exports.getSingle = function (/*string*/ name, /*function*/ callback) { 
  var result = sampleVote;
    
  return callback(result);
};
  
exports.getList = function (/*string*/ parameter, /*function*/ callback){
    // Getting a list of latest votes
    
};
  
exports.updateVote = function(/*string*/ name, /*integer*/ votedNumber, /*function*/ callback){
  console.log("updateVote: " + name + ", votedNumber: " + votedNumber); 
  //Increment the number that has the same index as the item voted for
  sampleVote.votes[votedNumber]++;
  return callback(sampleVote);
    
};
  
exports.createVote = function (/*String*/ question, /*string array*/ options, /*string*/ username, /*function*/callback){
  var votes = [];
  options.forEach(function(item){votes.push(0)});
  
  /*var vote = {
    question: question,
    choices: options,
    votes: votes,
    creator: username,
    voters: []
             };*/
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