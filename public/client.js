$(function(){
    
    var sendVote = function(event){
      
      event.preventDefault();
      
      //Make the form data sendable over http request
      var vote = $('form').serializeArray();
      console.log("vote: " + JSON.stringify(vote[0]));
      var vot = new XMLHttpRequest();
      
      vot.onreadystatechange = function(){
        if (vot.readyState == 4 && vot.status == 200) {
          console.log("POST action finished... in some way.");
          console.log("responseText: " + vot.responseText);
          
          //Making the score received as a response visible
          updateCurrentScore(JSON.parse(vot.responseText));
        } else {
          console.log("other");
        }
      }
      vot.open("POST", "/vote", true);
      vot.setRequestHeader("Content-type", "application/json");
      vot.send(JSON.stringify(vote));
    }
    
    function updateCurrentScore(voteObject){
      //Selecting display node and emptying it
      var meter = $("#currentScore");
      meter.empty();
        
      var htmlStart ='<div class="voteOptionContainer"><p class="voteOption">';
      var accumulator = "";
      var htmlEnd = '</p></div>';
      
      //Adding all the elements to the accumulating variable; 
      //In other words, gathering the data in a displayable form
      for (var i = 0; i < voteObject.votes.length; i++) {
        //console.log(i);
        var cur = htmlStart + voteObject.options[i] + '</p><p class=""voteCount>' + voteObject.votes[i] + htmlEnd;
        accumulator += cur;
        
        //Add current element to DOM
        meter.append(cur);
      }
    }
    
    //var tempCont = '<form><p>The Question</p><input type="radio">CHOICE</input><input type="radio">ALTERNATIVE</input><button type="submit">CAST YOUR VOTE</button></form>';
    //Init page
    var req = new XMLHttpRequest();
    req.onreadystatechange = function () 
    {
      if (req.readyState == 4 && req.status == 200) 
          {
            var voteNode = document.getElementById("qu");
            console.log("We have received data... but is it usable?");
            var data = JSON.parse(req.responseText);
            voteNode.innerHTML = '<form><p>' + data.question + '</p><div class="form-field"><input id="option1" type="radio" name="option" value="1"></input><label for="option1">' + data.options[0] + '</label></div><div class="form-field"><input id="option2" type="radio" name="option" value="2"></input><label for="option2">' + data.options[1] + '</label></div><button type="submit">Cast your vote</button></form>';
            //Set the event listener for voting
            $("form").submit(sendVote);
          }
    };
    
    req.open("GET", "/info", true);
    req.send(JSON.stringify({question: "answer"}));
  
  
    /*$('form').submit(function(event){
      
      
      event.preventDefault();
      console.log(3);
      console.log($('form').serializeArray());
      var vot = new XMLHttpRequest();
      vot.onreadystatechange = function(){
        
        if (req.readyState == 4 && req.status == 200) {
          console.log("POST action finished... in some way.");
          console.log(vot.responseText);
        } else {
          console.log("other");
        }
      }
      
      vot.open("POST", "/vote", true);
      vot.send(JSON.stringify({response:"1"}));
      
      
      
    });*/
    
    
    
  });