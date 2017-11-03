$(function(){
    
    
    var renderSignupForm = function(){
      var formContainer = document.getElementById("qu");
      
      formContainer.innerHTML = '<form id="signup"><input type="text" id="user" placeholder="username" name="signupForm"></input><input type="text" id="pwd" placeholder="password" name="signupForm"></input><input type="submit">Signup</input></form>';
       $("form").submit(signup);
    }
   
    var signup = function(event){
      event.preventDefault();
      
      var credentials = $('form').serializeArray();
      var sendable = {username: credentials[0].value, password: credentials[1].value};
      console.log(sendable);
      
      var req = new XMLHttpRequest();
      req.onreadystatechange = function () 
      {  
        if (req.readyState == 4 && req.status == 200) 
            {
              document.getElementById("qu").innerHTML = '<h2>Success!</h2>'
              var data = req.responseText;
              console.log (data);
              //$("form").submit(sendVote);
            }
      }
      
      req.open("PUT", "/signup", true);
      req.setRequestHeader("Content-type", "application/json");
      req.send(JSON.stringify(sendable));
    };
      
      renderSignupForm();
    
  });