// MonsterGrid.js
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

return declare("plugins.games.MonsterGrid", [], {

// cssFiles : Array
// CSS FILES
cssFiles : [
	require.toUrl("plugins/games/css/monstergrid.css")
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
    console.log("MonsterGrid.constructor    args:");
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
       switch(event.keyCode){
            case keys.RIGHT_ARROW:
                if ( thisObject.playerPosition.x == "5" ) {
                    //console.log("MonsterGrid.playGame    this.playerPosition.x == 5. Returning");
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
                if ( thisObject.playerPosition.x == "1" ) {
                    //console.log("MonsterGrid.playGame    this.playerPosition.x == 1. Returning");
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
                if ( thisObject.playerPosition.y == "1" ) {
                    //console.log("MonsterGrid.playGame    this.playerPosition.y == 1. Returning");
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
                if ( thisObject.playerPosition.y == "5" ) {
                    //console.log("MonsterGrid.playGame    this.playerPosition.y == 5. Returning");
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
    console.log("MonsterGrid.refreshTable    DOING this.clearTable()");

    console.log("MonsterGrid.refreshTable    DOING this.updateMonster()");

    var playerWon = this.checkWon();
    var playerLost = this.checkLost();
    if ( playerWon ) {
        this.clearTable();
        this.buildRows(this.rowData);
        this.displayWon();
    }
    else if ( playerLost ) {
        this.clearTable();
        this.buildRows(this.rowData);
        this.displayLost();
    }
    else {
        this.updateMonster();
        this.clearTable();
        this.buildRows(this.rowData);
    }    
},
checkWon : function () {
    if ( this.playerPosition.x == this.flaskPosition.x
        && this.playerPosition.y == this.flaskPosition.y ) {
        var audio = new Audio("plugins/games/sound/won.wav");
        audio.play();
        return true;
    }
    else {
        return false;
    }
},
checkLost : function () {
    console.log("MonsterGrid.checkLost    playerPosition: " + this.playerPosition.x + ", " + this.playerPosition.y);
    console.log("MonsterGrid.checkLost    monsterPosition: " + this.monsterPosition.x + ", " + this.monsterPosition.y);
    if ( this.playerPosition.x == this.monsterPosition.x
        && this.playerPosition.y == this.monsterPosition.y ) {
        var audio = new Audio("plugins/games/sound/lost.wav");
        audio.play();
        console.log("MonsterGrid.checkLost    Returning true");
        
        return true;
    }
    else {
        console.log("MonsterGrid.checkLost    Returning false");
        return false;
    }
},
displayLost: function () {
    console.log("MonsterGrid.displayLost");  
},
displayWon: function () {
    console.log("MonsterGrid.displayWon");  
},
updateMonster : function () {

    this.rowData[this.monsterPosition.y - 1][this.monsterPosition.x - 1] = " ";

    //this.monsterPosition  = this.randomMove(this.monsterPosition);
    //while ( ! this.isInsideTable(this.monsterPosition) ) {
    //    this.monsterPosition = this.randomMove(this.monsterPosition);
    //}

    this.monsterPosition  = this.directionMove(this.playerPosition, this.monsterPosition);
    while ( ! this.isInsideTable(this.monsterPosition) ) {
        this.monsterPosition = this.directionMove(this.playerPosition, this.monsterPosition);
    }
    
    this.rowData[this.monsterPosition.y - 1][this.monsterPosition.x - 1] = "M"

    console.log("MonsterGrid.updateMonster    RETURNING this.monsterPosition.x: " + this.monsterPosition.x + ", y: " + this.monsterPosition.y);    
},
randomMove : function (position) {
    console.log("MonsterGrid.randomMove    position.x: " + position.x + ", y: " + position.y);
    var maxPositions = 8;

    var choice = parseInt( (Math.random() * maxPositions) + 1);
    console.log("MonsterGrid.randomMove    choice: " + choice);
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
directionMove : function (playerPosition, monsterPosition) {
    console.log("MonsterGrid.directionMove    playerPosition.x: " + playerPosition.x + ", y: " + playerPosition.y);
    console.log("MonsterGrid.directionMove    monsterPosition.x: " + monsterPosition.x + ", y: " + monsterPosition.y);

    var relativePosition = this.subtractPosition(monsterPosition, playerPosition);
    console.log("MonsterGrid.directionMove    NEW relativePosition.x: " + relativePosition.x + ", y: " + relativePosition.y);
    
    /*
    
              QUADRANTS

                  |
              1   |  2
            ______|______
                  |
              3   |  4
                  |
    
    */
    
    if ( relativePosition.x <= 0 && relativePosition.y <= 0) {
    //if ( relativePosition.x <= 0 && relativePosition.y >= 0) {
        // QUADRANT 1
        if ( relativePosition.x != 0 ) {
            this.moveRight(monsterPosition);
        }
        else {
            this.moveDown(monsterPosition)
        }
    }    
    else if ( relativePosition.x >= 0 && relativePosition.y <= 0) {
    //else if ( relativePosition.x >= 0 && relativePosition.y >= 0) {
        // QUADRANT 2
        if ( relativePosition.x != 0 ) {
            this.moveLeft(monsterPosition);
        }
        else {
            this.moveDown(monsterPosition)
        }
    }
    else if ( relativePosition.x <= 0 && relativePosition.y >= 0) {
    //else if ( relativePosition.x <= 0 && relativePosition.y <= 0) {
        // QUADRANT 3
        if ( relativePosition.x != 0 ) {
            this.moveRight(monsterPosition);
        }
        else {
            this.moveUp(monsterPosition)
        }        
    }
    else {
        // QUADRANT 4
        if ( relativePosition.x != 0 ) {
            this.moveLeft(monsterPosition);
        }
        else {
            this.moveUp(monsterPosition)
        }
    }
     
    return monsterPosition;
},
moveLeft : function (position) {
    position.x = position.x - 1;
    
    return position;
},
moveRight : function (position) {
    position.x = position.x + 1;
    
    return position;
},
moveUp : function (position) {
    position.y = position.y - 1;
    
    return position;
},
moveDown : function (position) {
    position.y = position.y + 1;
    
    return position;
},

subtractPosition : function (firstPosition, secondPosition) {
    var relativePosition    =   {};
    relativePosition.x = firstPosition.x - secondPosition.x;
    relativePosition.y = firstPosition.y - secondPosition.y;

    return relativePosition;    
},
isInsideTable : function (position) {
    console.log("MonsterGrid.isInsideTable    position.x: " + position.x + ", y: " + position.y);
    if ( position.x > 0 && position.x < this.maxWidth + 1 ) {
        if ( position.y > 0 && position.y < this.maxHeight + 1 ) {
            console.log("MonsterGrid.isInsideTable    Returning true");
            return true;
        }
        else {
            console.log("MonsterGrid.isInsideTable    Returning false");
            return false;
        }
    }
    else {
        console.log("MonsterGrid.isInsideTable    Returning false");
        return false;
    }
},
buildTable : function () {
    var thisObject = this;
    if ( ! thisObject.table ) {
        thisObject.table = dom.byId("table");
        console.log("MonsterGrid.buildTable    AFTER dom.byId(),    this.table xxx:")
        console.dir({this_table:thisObject.table});
    }
    console.log("MonsterGrid.buildTable     this.table: " + this.table);
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

    console.log("MonsterGrid.initialiseRowData     this.rowData: " + this.rowData);
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
    console.log("MonsterGrid.positionExists    position: " + position.x + ", " + position.y);
    
    if (this.rowData[position.y - 1][position.x - 1] == " ") {
        console.log("MonsterGrid.positionExists    RETURNING false");
        return false;
    }
    else {
        console.log("MonsterGrid.positionExists    RETURNING true");
        return true;
    }
},
addPosition : function (letter) {
    var position = this.randomPosition();
    while ( this.positionExists(position) ) {
        position = this.randomPosition();
    }
    console.log("MonsterGrid.addPosition    position: " + position);
    console.dir({position:position});
        
    this.rowData[position.y - 1][position.x - 1] = letter;
    
    return {
        x: position.x,
        y: position.y
    };
},
initialiseRowData : function () {
    //console.log("MonsterGrid.initialiseRowData     this.maxWidth: " + this.maxWidth);
    //console.log("MonsterGrid.initialiseRowData     this.maxHeight: " + this.maxHeight);

    // create array of blanks
    this.rowData = [];
    for ( var rowCounter = 0; rowCounter < this.maxHeight; rowCounter++) {
        //console.log("MonsterGrid.initialiseRowData    rowCounter: " + rowCounter);
        
        var array = [];
        for ( var columnCounter = 0; columnCounter < this.maxWidth; columnCounter++) {
            //console.log("MonsterGrid.initialiseRowData    columnCounter: " + columnCounter);
            array.push(" "); 
        }
    
        this.rowData.push(array);
    }
    
    //console.log("MonsterGrid.initialiseRowData     this.rowData: " + this.rowData);
    //console.dir({this_rowData:this.rowData});   
},
randomPosition : function () {
// type: X, T, F or M
    var x = parseInt( (Math.random() * this.maxWidth) + 1 );
    var y = parseInt( (Math.random() * this.maxHeight) + 1 );    
    console.log("MonsterGrid.randomPosition    : " + x + ", " + y);
    
    return {
        x : x,
        y : y
    };
},
buildRows : function (rowData) {
    //console.log("MonsterGrid.buildRows    Doing ghroup rows, rowData.length: " + rowData.length);
    this.tableRows = [];

    for ( var rowCounter = 0; rowCounter < rowData.length; rowCounter++) {
        //console.log("MonsterGrid.buildRows    rowData[" + rowCounter + "]: " + dojo.toJson(rowData[rowCounter], true));
    
        var elements = rowData[rowCounter];
        var tableRow = domConstruct.create("tr");
        domClass.add(tableRow, "row");
        this.table.appendChild(tableRow);
        //console.log("MonsterGrid.buildRows    tableRow:");
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
    //console.log("MonsterGrid.buildRows     Completed buildRows");
},
clearTable : function () {
    //console.log("MonsterGrid.clearTable     this.table: " + this.table);
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
	console.log("    MonsterGrid.loadCSS");
	if ( cssFiles == null )
		cssFiles = this.cssFiles;
	//console.log("    MonsterGrid.loadCSS     cssFiles: " +  dojo.toJson(cssFiles, true));

	// LOAD CSS
	for ( var i in cssFiles ) {
		//console.log("    MonsterGrid.loadCSS     Loading CSS file: " + this.cssFiles[i]);
		this.loadCSSFile(cssFiles[i]);
	}
},
loadCSSFile : function (cssFile) {
	//console.log("    MonsterGrid.loadCSSFile    cssFile: " + cssFile);
	//console.log("    MonsterGrid.loadCSSFile    this.loadedCssFiles: " + dojo.toJson(this.loadedCssFiles));

	if ( this.loadedCssFiles == null || ! this.loadedCssFiles ) {
		//console.log("    MonsterGrid.loadCSSFile    Creating this.loadedCssFiles = new Object");
		this.loadedCssFiles = new Object;
	}

	if ( ! this.loadedCssFiles[cssFile] ) {
		//console.log("    MonsterGrid.loadCSSFile    Loading cssFile: " + cssFile);
		var cssNode = document.createElement('link');
		cssNode.type = 'text/css';
		cssNode.rel = 'stylesheet';
		cssNode.href = cssFile;
		document.getElementsByTagName("head")[0].appendChild(cssNode);

		this.loadedCssFiles[cssFile] = 1;
	}

	//console.log("    MonsterGrid.loadCSSFile    Returning this.loadedCssFiles: " + dojo.toJson(this.loadedCssFiles));

	return this.loadedCssFiles;
}

}); 	//	end declare

});	//	end define


//console.log("MonsterGrid END");



//console.log("monstergrid");
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




