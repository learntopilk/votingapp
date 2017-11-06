$(function(){
    
    
    var renderSignupForm = function(){
      var formContainer = document.getElementById("qu");
      
      formContainer.innerHTML = '<form id="signup"><input type="text" id="user" placeholder="username" name="signupForm" required></input><input type="password" id="pwd" placeholder="password" name="signupForm" required></input><input type="submit">Signup</input></form>';
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
              
              var info = req.response.responseInfo;
              console.log(data + ", " + info);
              //console.log(document.cookie);
              //$("form").submit(sendVote);
            }
      }
      
      req.open("PUT", "/signup", true);
      req.setRequestHeader("Content-type", "application/json");
      req.send(JSON.stringify(sendable));
    };
    $("header").prepend('<a href="/"><p>Main page</p></a><a href="/login" id="login"><p>Login</p></a>');
      renderSignupForm();
    
  });