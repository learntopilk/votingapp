$(function () {


    var renderVoteForm = function () {
        var formContainer = document.getElementById("qu");

        formContainer.innerHTML = '<form id="vote"><input type="text" id="question" placeholder="Your Question Here" name="VoteForm" required></input><input type="text" id="pwd" placeholder="Option" name="VoteForm" required></input><input type="text" id="pwd" placeholder="Option" name="VoteForm" required></input><input type="text" id="pwd" placeholder="Option" name="VoteForm" required></input><input type="submit">Create Vote</input></form>';
        $("form").submit(vote);
    }

    var vote = function (event) {
        event.preventDefault();

        let voteInfo = $('form').serializeArray();
        let optionArray = [];
        for (let i = 1; i < voteInfo.length; i++) {
            if (voteInfo[i] != "") {
                optionArray.push(voteInfo[i]);
            }
        }
        var sendable = { question: voteInfo[0].value, options: optionArray};
        console.log(sendable);

        var req = new XMLHttpRequest();
        req.onreadystatechange = function () {
            if (req.readyState == 4 && req.status == 200) {
                document.getElementById("qu").innerHTML = '<h2>Success!</h2><a href="/profile"><p>Go to Profile</p></a>'
                var data = req.responseText;
                console.log(data);
                //document.cookie = "signedIn=true;secure=true;max-age=120;name ="+ req.responseText.username +";";
                //console.log(document.cookie);
                //$("form").submit(sendVote);
            }
        }

        req.open("PUT", "/vote", true);
        req.setRequestHeader("Content-type", "application/json");
        req.send(JSON.stringify(sendable));
    };

    $("header").prepend('<a href="/"><p>Main page</p></a><a href="/logout" id="logout"><p>Logout</p></a><a href="/profile"><p>Profile</p></a>');
    renderVoteForm();

});