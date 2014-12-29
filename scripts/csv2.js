
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
//TODO: scrub names
//nflQBs[28][1] = nflQBs[28][1].replace('*','')
//nflQBs[28][1] = nflQBs[28][1].replace('+','')

function parseCSV(data) {
	var allTextLines = [];
	var fldHeading = [];
	// var fldData = [];
	var i = null;
	var x = 0;

	allTextLines = data.split(/\r\n|\n/);
	fldHeading = allTextLines[0].split(',');
	console.log(fldHeading);

	for (i = allTextLines.length - 1; i > 0; i--) {
		nflQBs[x] = allTextLines[i].split(',');
		x++;
	}
	console.log(nflQBs);
	alertify.success("Data has been parsed.");
}

