//File for interacting with the mongo database holding voting information
//TODO: Add capability to attach questions to users
var mongo = require("mongodb").MongoClient;
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var user = process.env.MONGODB_USER;
var pwd = process.env.MONGODB_PASSWORD;
var url = "mongodb://"+user+":"+pwd+"@ds157964.mlab.com:57964/jonbase";

// Defining user schema
var userSchema = new Schema({
  username: String,
  password: String,
  dateOfCreation: {type: Date, default: Date.now}
  
});

//Defining vote schema
/*var voteSchema = new Schema({
  question: {type: String, required: true},
  options: {type: Array, required: true},
  creator: {type: String, required: true},
  date: {type: Date, default: Date.now},
  open: {type: Boolean, default: true},
 // closes: {/*type: Date, default: new Date(Date.now + 60480000)*///  }
//});

var voteSchema = new Schema({
  question: {type: String, required: true},
  options: {type: Array, required: true},
  creator: {type: String, required: true},
  date: {type: Date, default: Date.now},
  votedIPs:{type: Array, default: []},
  open: {type: Boolean, default: true},
  closes: {/*type: Date, default: new Date(Date.now + 60480000)*/}
});

mongoose.connect(url);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', function(){
  console.log("Connected to database!");
});

var User = mongoose.model("user", userSchema, "users");
var Vote = mongoose.model("vote", voteSchema);

//START ROUTE LIST


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
// exports.listAllVotes returns a list of 10 latest votes, based of date of creation (presumably, needs to be verified).
// TODO: add capability to get 10 votes at a time so as to enable proper browsing of votes.
exports.listAllVotes = function (/*string parameter*/ /*integer*/ howMany, /*Integer*/ PageNumber, /*function*/ callback){
    // Getting a list of latest votes
  let q = Vote.find({}).sort({ natural: -1 }).limit(howMany);
  q.exec((err, res) => {
    if (err) {
      console.log(err);
    }
    if (res) {
      return callback(res);
    }

  });
//console.log(q);
//callback(q);
//return;
/*
    Vote.find((err, ret) => {
      if (err) {return console.log(err);}
      //console.log(res);
      return ret;
    }).sort({natural: -1}).limit(howMany);*/
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
  
// For updating votes 
// TODO: turn this into an actual database interaction
exports.updateVote = function(/*string*/ id, /*integer*/ votedNumber, /*String */ IP, /*function*/ callback){
  console.log("updateVote: " + id + ", votedNumber: " + votedNumber); 

  //Vote.findOneAndUpdate({"_id": id} (err));

  Vote.findOne({"_id": id}, (err, data) => {
    if (err) {
      console.log(err);
      return callback({updated: false, error: "Database error"});
    }
    if (data) {
      console.log(data);
      if (!data.votedIPs) {
        data.votedIPs = [IP];
      } else {
        data.votedIPs.push(IP);
        // TODO: SAVE THE CHANGED PIECE OF STUFF
      }
      // UPDATING THE OPTION FOR WHICH THE USER HAS VOTED
      data.options[votedNumber] = { q: data.options[votedNumber].q, v: data.options[votedNumber].v + 1};
     // console.log(data.options[votedNumber]);
      console.log(data);


// WHAT IS GOING ON HERE?
      Vote.collection.update({"_id": id}, data,{upsert: true}, (err, data) => {
      //data.save((err, data) => {
        if (err) {
          console.log(err);
        } else {
          console.log("This is the vote registration confirmation branch.");
          //console.log(data);
          return callback(data);
        }
      });

    }

  });
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

    console.log("db.deleteVote initiated for item: " + name);
    if (callback) {
      return callback(null);
    }

    
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