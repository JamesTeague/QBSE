//reference to database
var ref = new Firebase("https://qb-stock-exchange.firebaseio.com/");

//Handlebars helper to allow for 'if' logic
Handlebars.registerHelper('ifCond', function (v1, operator, v2, options) {
    switch (operator) {
        case '==':
            return (v1 == v2) ? options.fn(this) : options.inverse(this);
        case '===':
            return (v1 === v2) ? options.fn(this) : options.inverse(this);
        case '<':
            return (v1 < v2) ? options.fn(this) : options.inverse(this);
        case '<=':
            return (v1 <= v2) ? options.fn(this) : options.inverse(this);
        case '>':
            return (v1 > v2) ? options.fn(this) : options.inverse(this);
        case '>=':
            return (v1 >= v2) ? options.fn(this) : options.inverse(this);
        case '&&':
            return (v1 && v2) ? options.fn(this) : options.inverse(this);
        case '||':
            return (v1 || v2) ? options.fn(this) : options.inverse(this);
        default:
            return options.inverse(this);
    }
});
var qbList = [];
var stocksList = [];
//source and template for handlebars (qbs)
var source = $("#stockTemplate").html();
var template = Handlebars.compile(source);
$(function(){
	//source and template for handlebars (user stocks)
	var myStocks = $("#sidebarTemplate").html();
	var myStockTemplate = Handlebars.compile(myStocks);
	if(sessvars.sessionObj){
		updateSidebar();
	}
	if(sessvars.sessionObj.stocks){
		$("#sidebar-menu").removeClass("hidden");
		$.each(sessvars.sessionObj.stocks, function(key, value){
			stocksList.push({name: key, obj: value});
		});
		$("#sidebar-menu").html(myStockTemplate({stocks: stocksList}));
	}
});
//get all qbs from DB and add them to the page
ref.child("qb").once("value", function(s) { 
	_.each(s.val(), function(e,k,l){
		qbList.push({name: k, price: e.price, tier: e.tier, ref: e.reference, disp: e.displayInfo})
	});
	$("#stocks").html(template({qbs: qbList}));
});
/**
 * @function updateSidebar
 * @description Shows hidden sidebar with User name and Money
 * @param  {Boolean} bool true if the side bar needs to be shown otherwise false
 * @return none
 * @author James Teague II
 * @since 1/10/15
 */
function updateSidebar(bool){
	var show = bool || true
	$("#username").html(sessvars.sessionObj.name + "</br>$" + sessvars.sessionObj.purse);
	if(show){
		$("#sidebar-sub").removeClass("hidden");
		$("#stocks").addClass("col-md-10");
	}
}
function updateStocksBar(){
	$("#sidebar-menu").removeClass("hidden");
	$.each(sessvars.sessionObj.stocks, function(key, value){
		stocksList.push({name: key, obj: value});
	});
	$("#sidebar-menu").html(myStockTemplate({stocks: stocksList}));
}
/**
 * @function getName
 * @description takes in id name with _ and removes it
 * @param  {String} id id of <li> or <div> or <a> with an underscore
 * @return {String}    string without the _
 * @author James Teague II
 * @since 1/10/15
 */
function getName(id) {
	return id.replace("_"," ");
}
function changeTierFlag(){

}
/**
 * @function buyQB
 * @summary Allows user to buy stock on the clicked QB
 * @description When user clicks qb, find a reference to the QB in the DB
 * then using the price and how much money the user has, calc the number
 * they can purchase. Check to make sure they have enterend and integer
 * and that they can afford it. If so calculate the cost, unfreeze the 
 * session object to allow changes, make the transaction, and add the
 * stock to the session. After the transaction freeze the object and 
 * update the sidebar. Alert the user of the success.
 * @param  {String} refID id of the stock to be purchased
 * @return none
 * @author James Teague II
 * @since 1/10/15
 */
function buyQB(refID) {
	//if user is logged in
	if(ref.getAuth()){
		//get stock name for DB
		refID = getName(refID);
		ref.child("qb").child(refID).once('value', function(snap){
			//rename snapshot
			var qb = snap.val()
			//the amount user can afford
			var avail = Math.floor(sessvars.sessionObj.purse/qb.price);
			//prompt user for how many to buy
			alertify.prompt("How many stocks do you want to buy in "+snap.name()+"?", function(e,str){
				//if it is an integer and can afford to buy that many
				if (e && /^\d+$/.test(str) && (str <= avail)){
					//turn string into an integer
					var amt = parseInt(str);
					//calc the cost
					var total = amt * qb.price;
					//unfreeze to allow changes
					sessvars.sessionObj = SessionModule.defrost(sessvars.sessionObj);
					//start transaction
					sessvars.sessionObj.purse -= total.toFixed(2);
					sessvars.sessionObj.purse = sessvars.sessionObj.purse.toFixed(2);
					//if user has existing stocks
					if(sessvars.sessionObj.stocks){
						//if user has already bought that particular stock
						if(sessvars.sessionObj.stocks[refID]){
							//get the current amount of stock previously purchased
							var curTotal = sessvars.sessionObj.stocks[refID].amount;
							//new total of purchased stocks
							var newTotal = curTotal + amt;
							//update the object
							$.extend(sessvars.sessionObj.stocks, {[refID] :{"price": qb.price, "amount": newTotal, "tier": qb.tier}});
						}
						else{
							//update the object
							$.extend(sessvars.sessionObj.stocks, {[refID] :{"price": qb.price, "amount": amt, "tier": qb.tier}});
						}
						//freeze to prevent further unauthorized changes
						SessionModule.freeze(sessvars.sessionObj);
						updateSidebar(false);
						alertify.success(amt + " stocks purchased!");
					}
					else{
						//add the first stock to session object
						sessvars.sessionObj.stocks = {[refID] :{"price": qb.price, "amount": amt, "tier":qb.tier}};
						SessionModule.freeze(sessvars.sessionObj);
						updateSidebar(false);
						alertify.success(amt + " stocks purchased!");
					}
				}
				else if (e && /^\d+$/.test(str) && (str > avail)){
					alertify.log("Insufficient Funds!");
				}
				else if (e && !(/^\d+$/.test(str))){
					alertify.error("Not a valid Number")
				}
			}, ""+avail);
		});
	}
}