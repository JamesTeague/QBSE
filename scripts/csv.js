
/*jslint white: true */
$(function(){
	if(!sessvars.sessionObj || sessvars.sessionObj.level < 99){
		$('#content').hide();
		alertify.confirm("Sorry! You do not have access to this page.", function(e){
			if(e){
				window.location.href = "https://qb-stock-exchange.firebaseapp.com";
			}
			else{
				window.location.href = "https://qb-stock-exchange.firebaseapp.com";
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
 * @since 1/5/2015
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
	for(var ndx in nflQBs){
		nflQBs[ndx][1] = scrubText(nflQBs[ndx][1]);
		nflQBs[ndx][9] = scrubText(nflQBs[ndx][9]);
		nflQBs[ndx][6] = findWLD(nflQBs[ndx][6]);
	}
	alertify.success("Data has been parsed.");
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

