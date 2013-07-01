// janken

var choices1 = ["rock", "paper", "scissors"];
var choices2 = ["rock", "paper", "scissors"];

var choiceNumber = function (choice) {
    if ( choice == "rock" ) return 1;
    if ( choice == "paper" ) return 2;
    if ( choice == "scissors" ) return 3;
}

var winner = function (choice1, choice2) {
    var number1 = choiceNumber(choice1);
    var number2 = choiceNumber(choice2);
    
    var result = (number1 % 3) - number2 - 1;
    console.log("result: " + result);
    
    if ( result == 0 ) {
        return 0;
    }
    
    return 1;
}


// RUN TESTS

for ( var i = 0; i < choices1.length; i++) {
    var choice1 = choices1[i];
    
    for ( var j = 0; j < choices2.length; j++) {
        var choice2 = choices2[j];
        
        var win = winner(choice1, choice2);
        console.log("choice1: " + choice1 + ", choice2: " + choice2 + ", win: " + win)
    }
}


