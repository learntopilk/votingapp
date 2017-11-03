//File for interacting with the mongo database holding voting information
//TODO: add functionality for finding and creating users
//TODO: Add capability to attach questions to users
var mongo = require("mongodb").MongoClient;
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

//Defining user schema
var userSchema = new Schema({
  username: String,
  password: String,
  dateOfCreation: {type: Date, default: Date.now}
  
});
var User = mongoose.model("User", userSchema);


//Defining vote schema
var voteSchema = new Schema({
  question: String,
  options: Array,
  creator: String,
  date: {type: Date, default: Date.now},
  open: {type: Boolean, default: true},
  votes: Array
  
});
var Vote = mongoose.model("Vote", voteSchema);

//Add an IP list to this so as to allow IP checking
var sampleVote = {
  "question":"Question!!",
  "options":["this", "that"],
  "votes" :[20, 13]};
//Example of future form of the question:

/*
var question = {
  q: "<question>",
  choices: ["this", "that", "third"],
  voted: [1, 6, 0],
  creator: "<username>",
  voters: 
  } 

*/


  
exports.getSingle = function (/*string*/ name, /*function*/ callback) { 
  var result = sampleVote;
    
  return callback(result);
}
  
  
exports.getList = function (/*string*/ parameter, /*function*/ callback){
    
    
}
  
exports.updateVote = function(/*string*/ name, /*integer*/ votedNumber, /*function*/ callback){
  console.log("updateVote: " + name + ", votedNumber: " + votedNumber); 
  //Increment the number that has the same index as the item voted for
  sampleVote.votes[votedNumber]++;
  return callback(sampleVote);
    
}
  
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
}
  
exports.deleteVote = function (/*String*/ name, /*function*/ callback){
    //db.find({question: name}, function(err, data){return callback(data);});
    
};

//USER ACCOUNT HANDLES

exports.createUser = function(/*string*/username, /*string*/ password, /*function*/ callback) {
  
  // TODO: Check that username and password fulfill the following criteria:
  // -More than 6 characters
  var Us = new User({
    username: username,
    password: password,
    dataOfCreation: Date.now
    
  });
  console.log("New user created");
  console.log(Us);
  
  Us.save(function(err, Us){
    if (err) {return console.error(err);}
    return callback(Us);
    
  });
  
};

exports.getUserInfo = function(){
  
};
  
  
  
