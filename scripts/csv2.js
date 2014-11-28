/**
 * Constructor for the quarterback class
 * @param  {String} name    Name of the QB
 * @param  {double} QBR     Total QBR as of ESPN
 * @param  {double} RAT     Passer Rating (Scale from 0 - 158.3)
 * @param  {int} 	PassYds Total Pass Yard
 * @param  {int} 	WLD     Win-Loss Differential
 * @param  {int} 	TD      Passing Touchdowns
 * @param  {int} 	INT     Interceptions Thrown
 * @param  {double} Price   Calculated Stock Price (will be calculated)
 * @param  {int} 	Tier    Tier the QB ranks into (will be calculated)
 * @return none
 */
function quarterback (name, QBR, RAT, PassYds, WLD, TD, INT, Price, Tier) {
	this.qbr = QBR;
	this.rating = RAT;
	this.passYds = PassYds;
	this.winLoss = WLD;
	this.touchdowns = TD;
	this.interceptions = INT;
	this.StockInfo = {
		name: name,
		price: Price,
		tier: Tier
	};
}
var nflQBs = [[]];
//TODO: scrub names
//nflQBs[28][1] = nflQBs[28][1].replace('*','')
//nflQBs[28][1] = nflQBs[28][1].replace('+','')
function csv() {
	var allTextLines = [];
	
	var fldHeading = [];
	// var fldData = [];
	var i = null;
	var x = 0;
	allTextLines = $('#allText').val().split(/\r\n|\n/);

	
	fldHeading = allTextLines[0].split(',');

	console.log(fldHeading);
	
	
	for (i = allTextLines.length - 1; i > 0; i--) {
		nflQBs[x] = allTextLines[i].split(',');
		x++;
	}
	console.log(nflQBs);
}