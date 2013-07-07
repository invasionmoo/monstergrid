// Janken.js
/* summary:

    Allow the user to play the monster game

    INSTALL:
    
    1. DOWNLOAD dojo AND dijit
    
    git clone 
    
*/

define([
    "dojo/_base/declare",
    "dijit/registry",
    "dojo/dom",
    "dojo/keys",
    "dojo/_base/array",
    "dojo/on",
    "dojo/when",
    "dojo/_base/lang",
    "dojo/dom-attr",
    "dojo/dom-class",
    "dojo/dom-construct",
    "dojo/json",
    "dojo/ready",
    "dojo/domReady!"
],

function (declare, registry, dom, keys, arrayUtil, on, when, lang, domAttr, domClass, domConstruct, JSON, ready) {

////}}}}}

return declare("plugins.games.Janken", [], {

// cssFiles : Array
// CSS FILES
cssFiles : [
	require.toUrl("plugins/games/css/janken.css")
],

// VARIABLES
maxWidth : 5,
maxHeight : 5,
characterAlive : true,
characterWon : false,
monsterAwake : false,
monsterAwakened : false,
monsterMovePerTurn : 2,
playerPosition: null,
monsterPosition: null,
trapPosition : null,
flaskPosition : null,
//////}}

constructor : function(args) {		
    console.log("Janken.constructor    args:");
    console.dir({args:args});

    // MIXIN ARGS
    lang.mixin(this, args);

    // LOAD CSS
    this.loadCSS()

    //var thisObject = this;
    //ready(function() {
    //    thisObject.buildTable();
    //});
},
startup : function () {
    this.buildTable();
    this.playGame();    
},
playGame : function () {

    var thisObject = this;    
    on(document.body, "keyup", function(event){
        //console.log("Janken.startup    KEYUP event:");
        //console.dir({event:event});

        switch(event.keyCode){
            case keys.RIGHT_ARROW:
                //console.log("Janken.playGame    RIGHT ARROW");
                // handle right arrow
                
                if ( thisObject.playerPosition.x == "5" ) {
                    //console.log("Janken.playGame    this.playerPosition.x == 5. Returning");
                    return;
                }
                else {
                    thisObject.rowData[thisObject.playerPosition.y - 1][thisObject.playerPosition.x - 1] = " ";
                    thisObject.playerPosition.x = thisObject.playerPosition.x + 1;
                    thisObject.rowData[thisObject.playerPosition.y - 1][thisObject.playerPosition.x - 1] = "X";
                    thisObject.refreshTable();
                }
                
                break;

            case keys.LEFT_ARROW:
                //console.log("Janken.playGame    LEFT ARROW");
                // handle left arrow

                if ( thisObject.playerPosition.x == "1" ) {
                    //console.log("Janken.playGame    this.playerPosition.x == 1. Returning");
                    return;
                }
                else {
                    thisObject.rowData[thisObject.playerPosition.y - 1][thisObject.playerPosition.x - 1] = " ";
                    thisObject.playerPosition.x = thisObject.playerPosition.x - 1;
                    thisObject.rowData[thisObject.playerPosition.y - 1][thisObject.playerPosition.x - 1] = "X";
                    thisObject.refreshTable();
                }

                break;

            case keys.UP_ARROW:
                //console.log("Janken.playGame    UP ARROW");
                // handle left arrow

                if ( thisObject.playerPosition.y == "1" ) {
                    //console.log("Janken.playGame    this.playerPosition.y == 1. Returning");
                    return;
                }
                else {
                    thisObject.rowData[thisObject.playerPosition.y - 1][thisObject.playerPosition.x - 1] = " ";
                    thisObject.playerPosition.y = thisObject.playerPosition.y - 1;
                    thisObject.rowData[thisObject.playerPosition.y - 1][thisObject.playerPosition.x - 1] = "X"
                    thisObject.refreshTable();
                }

                break;

            case keys.DOWN_ARROW:
                //console.log("Janken.playGame    DOWN ARROW");
                // handle left arrow

                if ( thisObject.playerPosition.y == "5" ) {
                    //console.log("Janken.playGame    this.playerPosition.y == 5. Returning");
                    return;
                }
                else {
                    thisObject.rowData[thisObject.playerPosition.y - 1][thisObject.playerPosition.x - 1] = " ";
                    thisObject.playerPosition.y = thisObject.playerPosition.y + 1;
                    thisObject.rowData[thisObject.playerPosition.y - 1][thisObject.playerPosition.x - 1] = "X";
                    thisObject.refreshTable();
                }
                break;
        }
    });    
},
refreshTable : function () {
    console.log("Janken.refreshTable    DOING this.clearTable()");
    this.clearTable();

    console.log("Janken.refreshTable    DOING this.updateMonster()");
    this.updateMonster();

    this.buildRows(this.rowData);
},
updateMonster : function () {
    var randomMove = this.randomMove(this.monsterPosition);
    console.log("Janken.updateMonster    randomMove.x: " + randomMove.x + ", y: " + randomMove.y);
    
},
randomMove : function (position) {
    console.log("Janken.randomMove    position.x: " + position.x + ", y: " + position.y);
    var maxPositions = 8;

    var choice = parseInt( (Math.random() * maxPositions) );
    console.log("Janken.randomMove    choice: " + choice);
    switch (choice) {
        case 1:
            position.y = position.y - 1;
            break;
        case 2:
            position.y = position.y - 1;
            position.x = position.x + 1;
            break;
        case 3:
            position.x = position.x + 1;
            break;
        case 4:
            position.y = position.y + 1;
            position.x = position.x + 1;
            break;
        case 5:
            position.y = position.y + 1;
            break;
        case 6:
            position.y = position.y + 1;
            position.x = position.x - 1;
            break;
        case 7:
            position.x = position.x - 1;
            break;
        case 8:
            position.y = position.y - 1;
            position.x = position.x - 1;
            break;
    }

    return position;
},
isInsideTable : function (position) {
    console.log("Janken.isInsideTable    position.x: " + position.x + ", y: " + position.y);
    if ( position.x > 0 && position.x < this.maxWidth + 1 ) {
        if ( position.y > 0 && position.y < this.maxHeight + 1 ) {
            return true;
        }
        else {
            return false;
        }
    }
    else {
        return false;
    }
},
buildTable : function () {
    var thisObject = this;
    if ( ! thisObject.table ) {
        thisObject.table = dom.byId("table");
        console.log("Janken.buildTable    AFTER dom.byId(),    this.table xxx:")
        console.dir({this_table:thisObject.table});
    }
    console.log("Janken.buildTable     this.table: " + this.table);
    console.dir({this_table:this.table});

    this.clearTable();

    this.initialiseRowData();
    
    this.playerPosition = this.addPosition("X");
    console.log("initialiseRowData    DOING this.addPosition(M)");
    this.monsterPosition = this.addPosition("M");
    console.log("initialiseRowData    DOING this.addPosition(T)");
    this.trapPosition = this.addPosition("T");
    console.log("initialiseRowData    DOING this.addPosition(F)");
    this.flaskPosition = this.addPosition("F");

    console.log("Janken.initialiseRowData     this.rowData: " + this.rowData);
    console.dir({this_rowData:this.rowData});

    this.buildRows(this.rowData);
    
    //var rowData = [
    //    [" ", " ", "X", " "," "],
    //    [" ", " ", " ", " "," "],   
    //    [" ", " ", " ", "T"," "],    
    //    [" ", " ", " ", " "," "],   
    //    ["M", " ", " ", " ","F"]    
    //];
    //
    //this.buildRows(rowData);
},
positionExists : function (position) {
    console.log("Janken.positionExists    position: " + position.x + ", " + position.y);
    
    if (this.rowData[position.y - 1][position.x - 1] == " ") {
        console.log("Janken.positionExists    RETURNING false");
        return false;
    }
    else {
        console.log("Janken.positionExists    RETURNING true");
        return true;
    }
},
addPosition : function (letter) {
    var position = this.randomPosition();
    while ( this.positionExists(position) ) {
        position = this.randomPosition();
    }
    console.log("Janken.addPosition    position: " + position);
    console.dir({position:position});
        
    this.rowData[position.y - 1][position.x - 1] = letter;
    
    return {
        x: position.x,
        y: position.y
    };
},
initialiseRowData : function () {
    //console.log("Janken.initialiseRowData     this.maxWidth: " + this.maxWidth);
    //console.log("Janken.initialiseRowData     this.maxHeight: " + this.maxHeight);

    // create array of blanks
    this.rowData = [];
    for ( var rowCounter = 0; rowCounter < this.maxHeight; rowCounter++) {
        //console.log("Janken.initialiseRowData    rowCounter: " + rowCounter);
        
        var array = [];
        for ( var columnCounter = 0; columnCounter < this.maxWidth; columnCounter++) {
            //console.log("Janken.initialiseRowData    columnCounter: " + columnCounter);
            array.push(" "); 
        }
    
        this.rowData.push(array);
    }
    
    //console.log("Janken.initialiseRowData     this.rowData: " + this.rowData);
    //console.dir({this_rowData:this.rowData});   
},
randomPosition : function () {
// type: X, T, F or M
    var x = parseInt( (Math.random() * this.maxWidth) + 1 );
    var y = parseInt( (Math.random() * this.maxHeight) + 1 );    
    console.log("Janken.randomPosition    : " + x + ", " + y);
    
    return {
        x : x,
        y : y
    };
},
buildRows : function (rowData) {
    //console.log("Janken.buildRows    Doing ghroup rows, rowData.length: " + rowData.length);
    this.tableRows = [];

    for ( var rowCounter = 0; rowCounter < rowData.length; rowCounter++) {
        //console.log("Janken.buildRows    rowData[" + rowCounter + "]: " + dojo.toJson(rowData[rowCounter], true));
    
        var elements = rowData[rowCounter];
        var tableRow = domConstruct.create("tr");
        domClass.add(tableRow, "row");
        this.table.appendChild(tableRow);
        //console.log("Janken.buildRows    tableRow:");
        //console.dir({tableRow:tableRow});

        for ( var j = 0; j < elements.length; j++ ) {
            var tableData = domConstruct.create('td');
            if ( elements[j] == "X") {
                domClass.add(tableData, "player");
            }
            else if ( elements[j] == "M") {
                domClass.add(tableData, "monster");
            }
            else if ( elements[j] == "F") {
                domClass.add(tableData, "flask");
            }
            else if ( elements[j] == "T") {
                domClass.add(tableData, "trap");
            }
            else {
                tableData.innerHTML = elements[j];
            }
            tableRow.appendChild(tableData);
        }
        
        //rowData[rowCounter].parentWidget = this;
        //this.table.appendChild(accessRow.row);
        //this.tableRows.push(accessRow);
    }
    //console.log("Janken.buildRows     Completed buildRows");
},
clearTable : function () {
    //console.log("Janken.clearTable     this.table: " + this.table);
    //console.dir({this_table:this.table});

    // CLEAN TABLE
    if ( this.table.childNodes ) {
        while ( this.table.childNodes.length > 0 ) {
            this.table.removeChild(this.table.childNodes[0]);
        }
    }
},
compare : function (choice1, choice2) {
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

    return null;
},
loadCSS : function (cssFiles) {
	console.log("    Janken.loadCSS");
	if ( cssFiles == null )
		cssFiles = this.cssFiles;
	//console.log("    Janken.loadCSS     cssFiles: " +  dojo.toJson(cssFiles, true));

	// LOAD CSS
	for ( var i in cssFiles ) {
		//console.log("    Janken.loadCSS     Loading CSS file: " + this.cssFiles[i]);
		this.loadCSSFile(cssFiles[i]);
	}
},
loadCSSFile : function (cssFile) {
	//console.log("    Janken.loadCSSFile    cssFile: " + cssFile);
	//console.log("    Janken.loadCSSFile    this.loadedCssFiles: " + dojo.toJson(this.loadedCssFiles));

	if ( this.loadedCssFiles == null || ! this.loadedCssFiles ) {
		//console.log("    Janken.loadCSSFile    Creating this.loadedCssFiles = new Object");
		this.loadedCssFiles = new Object;
	}

	if ( ! this.loadedCssFiles[cssFile] ) {
		//console.log("    Janken.loadCSSFile    Loading cssFile: " + cssFile);
		var cssNode = document.createElement('link');
		cssNode.type = 'text/css';
		cssNode.rel = 'stylesheet';
		cssNode.href = cssFile;
		document.getElementsByTagName("head")[0].appendChild(cssNode);

		this.loadedCssFiles[cssFile] = 1;
	}

	//console.log("    Janken.loadCSSFile    Returning this.loadedCssFiles: " + dojo.toJson(this.loadedCssFiles));

	return this.loadedCssFiles;
}

}); 	//	end declare

});	//	end define


//console.log("Janken END");



//console.log("janken");
//
//var choices1 = ["rock", "paper", "scissors"];
//var choices2 = ["rock", "paper", "scissors"];
//
//var choiceNumber = function (choice) {
//    if ( choice == "rock" ) return 1;
//    if ( choice == "paper" ) return 2;
//    if ( choice == "scissors" ) return 3;
//}
//
//var winner = function (choice1, choice2) {
//    var number1 = choiceNumber(choice1);
//    var number2 = choiceNumber(choice2);
//    
//    var result = (number1 % 3) - number2 - 1;
//    console.log("result: " + result);
//    
//    if ( result == 0 ) {
//        return 0;
//    }
//    
//    return 1;
//}


//
//// RUN TESTS
//var expected = [0, -1, 1, 1, 0, -1, -1, 1, 0];
//var results = [];
//for ( var i = 0; i < choices1.length; i++) {
//    var choice1 = choices1[i];
//    
//    for ( var j = 0; j < choices2.length; j++) {
//        var choice2 = choices2[j];
//        
//        //var win = winner(choice1, choice2);
//        //console.log("choice1: " + choice1 + ", choice2: " + choice2 + ", win: " + win)
//        var win = compare(choice1, choice2);
//        console.log("AFTER compare: choice1: " + choice1 + ", choice2: " + choice2 + ", win: " + win)
//        
//        results.push(win);
//    }
//}
//
//console.log("results: ");
//console.dir({results:results});
//console.log("expected: ");
//console.dir({expected:expected});
//




