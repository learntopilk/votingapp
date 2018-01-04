//import { forEach } from "../../../../AppData/Local/Microsoft/TypeScript/2.6/node_modules/@types/async";

$(function(){

    

    function renderNavigation(){
        let siteNav = document.createElement(div);
        siteNav.className = "siteNav";
        // Here: Check sign-in status with server,
        // if signed in, server sends appopriate 
        // navigation links


        
    }
    
    let updateVoteInformation = function(){
        console.log("updating...");
        let voteReq = new XMLHttpRequest();
        voteReq.onreadystatechange = function () {
            if (voteReq.readyState == 4 && voteReq.status == 200) 
            {
              //document.getElementById("qu").innerHTML = '<h2>Success!</h2>'
                let data = voteReq.responseText;
                console.log("Received user vote data.");
                //let info = voteReq.response.responseInfo;
                console.log(data);
                renderVotes(JSON.parse(data));

                
                //console.log(data + ", " + info);
            }
        };

        voteReq.open("GET", "/voteList", true);
        voteReq.setRequestHeader("Content-type", "application/json");
        voteReq.send();
    }

    let setVoteEventHandlers = function() {
        //let votes = document.get


    }
    
    let renderVotes = function(incomingData){


      let voteContainer = document.getElementById("qu");

        //let votes = "";
        incomingData.forEach((el) => {
            if (el.question != "undefined") {
                let vote = document.createElement('div');
                vote.className = "singleVote";
                vote.innerHTML = '<h4 id=' + el._id + '>' + el.question + '</h4>';
                let count = 0;
                el.options.forEach((option) => {
                    let currentOption = document.createElement('div');
                    let currentVoteButton = document.createElement('button');

                    currentVoteButton.textContent = "Vote For This";
                    currentVoteButton.className = "votebtn";
                    currentVoteButton.alt = i.toString();
                    
                    currentOption.className = "option";
                    currentOption.innerHTML = '<p class="op">' + option.q + '</p><p class="count">' + option.v + '</p>';
                    currentOption.appendChild(currentVoteButton);

                    //currentVoteButton
                    
                    vote.appendChild(currentOption);
                    //vote.appendChild(currentVoteButton);
                    count++;
                });
                //vote.appendChild('');
                voteContainer.appendChild(vote);
            }
        });

        setVoteEventHandlers();


      //voteContainer.innerHTML = '<form id="vote-container"><input type="text" id="user" placeholder="username" name="signupForm" required></input><input type="password" id="pwd" placeholder="password" name="signupForm" required></input><input type="submit">Signup</input></form>';
       //$("form").submit(signup);
    }

    //$("header").prepend('<a href="/"><p>Main page</p></a><a href="/logout" id="logout"><p>Logout</p></a>');
    updateVoteInformation();
    
  });