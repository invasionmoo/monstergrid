// Janken.js
/* summary:

        Allow the user to play the monster game
        
*/

define([
    "dojo/_base/declare",
    "dojo/_base/array",
    "dojo/on",
    "dojo/when",
    "dojo/_base/lang",
    "dojo/dom-attr",
    "dojo/dom-class",
    "dojo/json",

    "dojo/ready",
    "dojo/domReady!"
],

function (declare, arrayUtil, on, when, lang, domAttr, domClass, JSON, ready) {

////}}}}}

return declare("Janken",[], {

// cssFiles : Array
// CSS FILES
cssFiles : [
	require.toUrl("dojo/resources/dojo.css"),
	require.toUrl("plugins/xy/css/xy.css"),
	require.toUrl("dojox/layout/resources/ExpandoPane.css"),
	require.toUrl("plugins/xy/images/elusive/css/elusive-webfont.css")
],

// VARIABLES
max_width : 5,
max_height : 5,
character_alive : true,
character_won : false,
monster_awake : false,
monster_awakened : false,
monster_move_per_turn : 2,

//////}}

constructor : function(args) {		
    console.log("Janken.constructor    args:");
    console.dir({args:args});

    // MIXIN ARGS
    lang.mixin(this, args);

    // LOAD CSS
    //this.loadCSS()

    ready(function() {
        this.table = dojo.byId("table");
        console.log("Janken.constructor    this.table:")
        console.dir({this_table:this.table});
    
        this.buildTable();
    });
},
buildTable : function () {
    console.log("Janken.buildTable     this.table: " + this.table);
    console.dir({this_table:this.table});

    this.clearTable();

    // BUILD ROWS
    //console.log("Janken.buildTable::groupTable     Doing group rows, accessArray.length: " + accessArray.length);
    this.tableRows = [];
    for ( var rowCounter = 0; rowCounter < accessArray.length; rowCounter++)
    {
    //console.log("Janken.buildTable::groupTable     accessArray[" + rowCounter + "]: " + dojo.toJson(accessArray[rowCounter], true));
            accessArray[rowCounter].parentWidget = this;
            var accessRow = new plugins.sharing.AccessRow(accessArray[rowCounter]);
    //console.log("Janken.buildTable::groupTable     Doing group rows, accessRow: " + accessRow);
    //console.log("Janken.buildTable::groupTable     Doing group rows, accessRow.row: " + accessRow.row);
            this.table.appendChild(accessRow.row);
            this.tableRows.push(accessRow);
    }
    //console.log("Janken.buildTable     Completed buildTable");

},	// buildTable

clearTable : function () {
    console.log("Janken.clearTable     this.table: " + this.table);
    console.dir({this_table:this.table});

    // CLEAN TABLE
    if ( this.table.childNodes )
    {
        while ( this.table.childNodes.length > 2 )
        {
                this.table.removeChild(this.table.childNodes[2]);
        }
    }
}

}); 	//	end declare

});	//	end define



console.log("janken");

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

var compare = function (choice1, choice2) {
// RETURN 1 IF choice1 WINS
// RETURN 0 IF choice1 == choice2
// RETURN -1 IF choice2 WINS

    if ( choice1 == choice2 )   return 0;

    if ( choice1 == "rock" ) {
        if (choice2 == "paper") {
            return -1;
        }
        else {
            return 1;
        }
    }
    if ( choice1 == "scissors" ) {
        if (choice2 == "paper") {
            return 1;
        }
        else {
            return -1;
        }
    }
    if ( choice1 == "paper" ) {
        if (choice2 == "rock") {
            return 1;
        }
        else {
            return -1;
        }
    }
}


// RUN TESTS
var expected = [0, -1, 1, 1, 0, -1, -1, 1, 0];
var results = [];
for ( var i = 0; i < choices1.length; i++) {
    var choice1 = choices1[i];
    
    for ( var j = 0; j < choices2.length; j++) {
        var choice2 = choices2[j];
        
        //var win = winner(choice1, choice2);
        //console.log("choice1: " + choice1 + ", choice2: " + choice2 + ", win: " + win)
        var win = compare(choice1, choice2);
        console.log("AFTER compare: choice1: " + choice1 + ", choice2: " + choice2 + ", win: " + win)
        
        results.push(win);
    }
}

console.log("results: ");
console.dir({results:results});
console.log("expected: ");
console.dir({expected:expected});


