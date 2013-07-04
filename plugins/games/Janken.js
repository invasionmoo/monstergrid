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

function (declare, registry, dom, arrayUtil, on, when, lang, domAttr, domClass, domConstruct, JSON, ready) {

////}}}}}

return declare("plugins.games.Janken", [], {

// cssFiles : Array
// CSS FILES
cssFiles : [
	//require.toUrl("dojo/resources/dojo.css"),
	//require.toUrl("plugins/xy/css/xy.css"),
	//require.toUrl("dojox/layout/resources/ExpandoPane.css"),
	//require.toUrl("plugins/xy/images/elusive/css/elusive-webfont.css")
	require.toUrl("plugins/games/css/janken.css")
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
    this.loadCSS()

    //var thisObject = this;
    //ready(function() {
    //    thisObject.buildTable();
    //});
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

    var rowData = [    
        [" ", " ", "X", " "," "],
        [" ", " ", " ", " "," "],   
        [" ", " ", " ", "T"," "],    
        [" ", " ", " ", " "," "],   
        ["M", " ", " ", " ","F"]    
    ];
    
    this.buildRows(rowData);
},
buildRows : function (rowData) {
    console.log("Janken.buildRows    Doing group rows, rowData.length: " + rowData.length);
    this.tableRows = [];

    for ( var rowCounter = 0; rowCounter < rowData.length; rowCounter++) {
        console.log("Janken.buildRows    rowData[" + rowCounter + "]: " + dojo.toJson(rowData[rowCounter], true));
    
        var elements = rowData[rowCounter];
        var tableRow = domConstruct.create("tr");
        domClass.add(tableRow, "row");
        this.table.appendChild(tableRow);
        console.log("Janken.buildRows    tableRow:");
        console.dir({tableRow:tableRow});

        for ( var j = 0; j < elements.length; j++ ) {
            var tableData = domConstruct.create('td');
            if ( elements[j] == "F") {
                domClass.add(tableData, "flask");
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
    console.log("Janken.buildRows     Completed buildRows");

},
clearTable : function () {
    console.log("Janken.clearTable     this.table: " + this.table);
    console.dir({this_table:this.table});

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


console.log("Janken END");



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




