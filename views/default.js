//import { forEach } from "../../../../AppData/Local/Microsoft/TypeScript/2.6/node_modules/@types/async";

$(function(){

    

    function renderNavigation(){

        // TODO: make this work
        let siteNav = document.createElement(div);
        siteNav.className = "siteNav";
        // Here: Check sign-in status with server,
        // if signed in, server sends appopriate 
        // navigation links

    }

    // event handler for voting buttons
    function voteButtonPressed(e) {

        sendVote(e.target.getAttribute('data-id'), e.target.getAttribute('data-value'));
        e.target.setAttribute('disabled', 'true');
        e.target.className = 'votebtn disabledbtn';
        let botans = document.body.querySelectorAll("[data-id=\'" + e.target.getAttribute('data-id') + '\']')
        console.log(botans);

        for (let i = 0; i < botans.length; i++) {
            console.log(botans[i]);
            //botans[i].removeEventListener('click', (e) => {voteButtonPressed(e)});
            botans[i].removeEventListener('click', voteButtonPressed);
            botans[i].setAttribute('disabled', 'true');
            botans[i].className = 'votebtn disabledbtn';
        }
        e.target.className = 'votebtn disabledbtn voted_for';
    }
    

    // Method for sending a vote into the voting system.
    let sendVote = function(/*String */ id, /*int*/ optionNumber){
        console.log("sending vote...");
        let voteReq = new XMLHttpRequest();
        let body = {
            _id: id,
            option: optionNumber
        };
        voteReq.onreadystatechange = function () {
            if (voteReq.readyState == 4 && voteReq.status == 200) 
            {
                //TODO: add response handling
                let data = voteReq.responseText;
                console.log("Received data regarding sent vote.");
                console.log(data);
                //renderVotes(JSON.parse(data));
            }
        };
        voteReq.open("POST", "/vote", true);
        voteReq.setRequestHeader("Content-type", "application/json");
        voteReq.send(JSON.stringify(body));
    }


    // Gets a list of votes from the server to display on the page
    let updateVoteInformation = function(){
        console.log("updating...");
        let voteReq = new XMLHttpRequest();
        voteReq.onreadystatechange = function () {
            if (voteReq.readyState == 4 && voteReq.status == 200) 
            {
              
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

    // Sets and updates the event handlers on voting buttons.
    let setVoteEventHandlers = function() {
        let voteContainers = document.getElementsByClassName('singleVote');

        for (let i = 0; i < voteContainers.length; i++){
            let vote = voteContainers[i];
            let options = vote.querySelectorAll('.option');

            for (let i2 = 0; i2 < options.length; i2++){
                options[i2].querySelector('.votebtn').addEventListener('click', voteButtonPressed);
                /*options[i2].querySelector('.votebtn').addEventListener('click', (e) => {voteButtonPressed(e)});/*(e) => {
                    

                    sendVote(options[i2].getAttribute('data-id'), options[i2].getAttribute('data-value'));
                    e.target.setAttribute('disabled', 'true');
                    e.target.className = 'votebtn disabledbtn';
                    let botans = document.body.querySelectorAll("[data-id=\'" + e.target.getAttribute('data-id') + '\']')
                    console.log(botans);
                    botans.unbind();
                });*/
            }
        }
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
                    currentVoteButton.setAttribute("data-value", count);
                    currentVoteButton.setAttribute("data-id", el._id);
                   // alt = i.toString();
                    
                    currentOption.className = "option";
                    currentOption.innerHTML = '<p class="op">' + option.q + '</p><p class="count">' + option.v + '</p>';
                    currentOption.appendChild(currentVoteButton);

                    //currentVoteButton
                    
                    vote.appendChild(currentOption);
                    count++;
                });
                voteContainer.appendChild(vote);
            }
        });

        setVoteEventHandlers();

    }
    updateVoteInformation();
  });