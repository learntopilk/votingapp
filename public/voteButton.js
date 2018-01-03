// vote button

let vclass = 'singleVote'

let votes = document.getElementsByClassName(vclass);

for (let el in votes) {
    let options = this.find('.option');

    for (var i = 0; i < options.length; i++) {
        options[i].append('<button opnumber="' + i + '" voteid="' + element._id +'">Vote for this</button>');
        console.log(options.i);
    }

}


/*
    votes.forEach(element => {
    let options = this.find('.option');

    for (var i = 0; i < options.length; i++) {
        options[i].append('<button opnumber="' + i + '" voteid="' + element._id +'">Vote for this</button>');
    }
    //element.append('<button class=' + element. + '>vote</button>');
});*/
