
/*jslint white: true */
var ref = new Firebase("https://qb-stock-exchange.firebaseio.com/");
$(function(){
	if(!sessvars.sessionObj || sessvars.sessionObj.level < 99){
		$('#content').hide();
		alertify.confirm("Sorry! You do not have access to this page.", function(e){
			if(e){
				window.location.href = "/";
			}
			else{
				window.location.href = "/";
			}
		});
	}
});
/**
 * @function getFile
 * @description Takes in filename and type for an ajax
 * call that will get the file and retrieve the data. 
 * On a success, the data is passed to another function
 * for parsing. It has a default value of "qb.txt" and
 * "text" if nothing is passed in to be parsed.
 * @summary Gets a File's data for parsing.
 * @param  {String} filename name of file to be parsed
 * @param  {String} type     type of file
 * @return none
 * @see parseCSV
 * @author James Teague II
 * @since 12/13/2014
 */
function getFile(filename, type){
	var type = type || "text";
	if(!filename){type = "text";}
	var fname = filename || "qb.txt";
	fname = "/scripts/data/"+fname;
	$.ajax({
        type: "GET",
        url: fname,
        dataType: type,
        success: function(data) {parseCSV(data);},
        error: function(jqXHR, status, err){alert(status, err);}
     });
}

var nflQBs = [[]];
/**
 * @function parseCSV
 * @description Reads in the data from the given csv file for QB's
 * Removes the heading, and parses the rest of the stats giving each
 * quarterback his own array within a holding array. Will scrub the
 * text of all the data, and find the win loss differential.
 * @param  {String} data data of the file
 * @return none
 * @author James Teague II
 * @since 1/6/2015
 */
function parseCSV(data) {
	var allTextLines = [];
	var fldHeading = [];
	var i = null;
	var x = 0;

	allTextLines = data.split(/\r\n|\n/);
	fldHeading = allTextLines[0].split(',');

	for (i = allTextLines.length - 1; i > 0; i--) {
		nflQBs[x] = allTextLines[i].split(',');
		x++;
	}
	alertify.success("Data has been parsed.");
	for (var ndx = nflQBs.length - 1; ndx >= 0; ndx--) {
		if(nflQBs[ndx][8] < 5){
			console.log(nflQBs[ndx][1]);
			nflQBs.splice(ndx,1);
		}
		else{
			nflQBs[ndx][1] = scrubText(nflQBs[ndx][1]);
			//creating a reference for QB
			nflQBs[ndx].push(nflQBs[ndx][1].replace(" ","_"));
			nflQBs[ndx][9] = scrubText(nflQBs[ndx][9]);
			nflQBs[ndx][6] = findWLD(nflQBs[ndx][6]);
		}
	};
	fillZeroes(nflQBs);
	alertify.success("Data has been cleaned.")
	calcPrice(nflQBs);
	alertify.success("Prices Calculated.")
	addToDB(nflQBs);
	alertify.success("Added to Database.");
}
/**
 * @function findWLD
 * @description Converts the QB record into a +/- number
 * (Ties are not rewarded)
 * @param  {String} rec QB record such as 6-8-1
 * @return {Integer}     +/- differential
 * @author James Teague II
 * @since 1/5/2015
 */
function findWLD(rec){
	var arrRec = rec.split("-");
	var wld = arrRec[0] - arrRec[1];
	return wld;
}
/**
 * @function fillZeroes
 * @description Fills all blank indexes with 
 * @param  {Object} qbs array of QBs
 * @return none
 * @author James Teague II
 * @since 1/6/2015
 */
function fillZeroes(qbs){
	for (var i = qbs.length - 1; i >= 0; i--) {
		for(var j = qbs[i].length - 1; j >= 0; j--){
			if(qbs[i][j] === "" || (isNaN(qbs[i][j]) && typeof qbs[i][j] === "number")){
				qbs[i][j] = 0;
			}
		}
	};
}
/**
 * @function scrubText
 * @description Removes +,*,% from the string
 * @param  {String} text string of almost anything
 * @return {String}      string without +,*,%
 * @author James Teague II
 * @since 1/5/2015
 */
function scrubText(text){
	return text.replace(/\+|\*|\%/g,'');
}
/**
 * @function calcPrice
 * @description Calculates the Price and the Tier for each QB
 * @param  {Object} qbs array of QBs
 * @return none
 * @author James Teague II
 * @since 1/6/2015
 */
function calcPrice(qbs){
	var WLx = 3;
	var Compx = 0.5;
	var Yardsx = 0.003;
	var TDx = 1;
	var INTx = 2.5;
	var QBRx = 0.35;
	var Ratx = 0.20;
	var INTpx = 1;
	var FQCx = 12;
	var GWDx = 8;
	var tier = 0;

	for (var i = qbs.length - 1; i >= 0; i--) {
		var price = (WLx*qbs[i][6])
					+ (Compx*qbs[i][9])
					+ (Yardsx*qbs[i][10])
					+ (TDx*qbs[i][11])
					+ (-INTx*qbs[i][13])
					+ (QBRx*qbs[i][21])
					+ (Ratx*qbs[i][20])
					+ (-INTpx*qbs[i][14])
					+ (FQCx*qbs[i][27])
					+ (GWDx*qbs[i][27]);
		price = price.toFixed(2);
		if(price <= 50){
			tier = 4;
		}
		else if (price <= 100){
			tier = 3;
		}
		else if (price <= 150){
			tier = 2;
		}
		else if (price <= 0){
			nflQBs.splice(i,1);
		}
		else {
			tier = 1;
		}
		qbs[i].push(price, tier);
	}
}
/**
 * @function addToDB
 * @param {Object} qbs array of QBs
 * @returns none
 * @author James Teague
 * @since 1/6/2015
 */
function addToDB(qbs){
	for (var ndx = qbs.length - 1; ndx >= 0; ndx--) {
		ref.child('qb').child(qbs[ndx][1]).set({
			"reference": qbs[ndx][29], 
			"price": qbs[ndx][30], 
			"tier": qbs[ndx][31],
			"displayInfo": {
				"yards": qbs[ndx][10],
				"TD": qbs[ndx][11],
				"INT": qbs[ndx][13],
				"Comp": qbs[ndx][9]
			}
		});
	};
}
/*
 * 0 Rk,
 * 1 name,
 * 2 Tm,
 * 3 Age,
 * 4 G,
 * 5 GS,
 * 6 QBrec,
 * 7 Cmp,
 * 8 Att,
 * 9 Cmp%,
 * 10 Yds,
 * 11 TD,
 * 12 TD%,
 * 13 Int,
 * 14 Int%,
 * 15 Lng,
 * 16 Y/A,
 * 17 AY/A,
 * 18 Y/C,
 * 19 Y/G,
 * 20 Rate,
 * 21 QBR,
 * 22 Sk,
 * 23 Yds,
 * 24 NY/A,
 * 25 ANY/A,
 * 26 Sk%,
 * 27 4QC,
 * 28 GWD
 */

