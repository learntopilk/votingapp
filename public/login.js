$(function(){
    
    
    var renderLoginForm = function(){
      var formContainer = document.getElementById("qu");
      
      formContainer.innerHTML = '<form id="login"><input type="text" id="user" placeholder="username" name="loginForm" required></input><input type="password" id="pwd" placeholder="password" name="loginForm" required></input><input type="submit">Login</input></form>';
       $("form").submit(login);
    }
   
    var login = function(event){
      event.preventDefault();
      
      var credentials = $('form').serializeArray();
      var sendable = {username: credentials[0].value, password: credentials[1].value};
      console.log(sendable);
      
      var req = new XMLHttpRequest();
      req.onreadystatechange = function () 
      {  
        if (req.readyState == 4 && req.status == 200) 
            {
              document.getElementById("qu").innerHTML = '<h2>Success!</h2><a href="/profile"><p>Go to Profile</p></a>'
              var data = req.responseText;
              console.log (data);
              //document.cookie = "signedIn=true;secure=true;max-age=120;name ="+ req.responseText.username +";";
              //console.log(document.cookie);
              //$("form").submit(sendVote);
            }
      }
      
      req.open("POST", "/login", true);
      req.setRequestHeader("Content-type", "application/json");
      req.send(JSON.stringify(sendable));
    };
      
    $("header").prepend('<a href="/"><p>Main page</p></a><a href="/signup" id="signup"><p>Signup</p></a>');
    renderLoginForm();
    
  });