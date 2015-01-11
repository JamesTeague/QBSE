var ref = new Firebase("https://qb-stock-exchange.firebaseio.com/");

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
var source = $("#stockTemplate").html();
var template = Handlebars.compile(source);
$(function(){
	if(sessvars.sessionObj){
		updateSidebar();
	}
});
ref.child("qb").once("value", function(s) { 
	_.each(s.val(), function(e,k,l){
		qbList.push({name: k, price: e.price, tier: e.tier, ref: e.reference, disp: e.displayInfo})
	});
	$("#stocks").html(template({qbs: qbList}));
});
function updateSidebar(bool){
	var show = bool || true
	$("#username").html(sessvars.sessionObj.name + "</br>$" + sessvars.sessionObj.purse);
	if(show){
		$("#sidebar-menu").removeClass("hidden");
		$("#stocks").addClass("col-md-11");
	}
}
function getName(id) {
	return id.replace("_"," ");
}
function changeTierFlag(){

}
function buyQB(refID) {
	if(ref.getAuth()){
		refID = getName(refID);
		ref.child("qb").child(refID).once('value', function(snap){
			var qb = snap.val()
			var avail = Math.floor(sessvars.sessionObj.purse/qb.price);
			alertify.prompt("How many stocks do you want to buy in "+snap.name()+"?", function(e,str){
				if (e && /^\d+$/.test(str) && (str <= avail)){
					var cost = parseInt(str);
					var total = cost * qb.price;
					sessvars.sessionObj = SessionModule.defrost(sessvars.sessionObj);
					sessvars.sessionObj.purse -= total.toFixed(2);
					sessvars.sessionObj.purse = sessvars.sessionObj.purse.toFixed(2);
					if(sessvars.sessionObj.stocks){
						if(sessvars.sessionObj.stocks[refID]){
							var curTotal = sessvars.sessionObj.stocks[refID].amount;
							var newTotal = curTotal + cost;
							$.extend(sessvars.sessionObj.stocks, {[refID] :{"price": qb.price, "amount": newTotal, "tier": qb.tier}});
						}
						else{
							$.extend(sessvars.sessionObj.stocks, {[refID] :{"price": qb.price, "amount": cost, "tier": qb.tier}});
						}
						SessionModule.freeze(sessvars.sessionObj);
						updateSidebar(false);
						alertify.success(cost + " stocks purchased!");
					}
					else{
						sessvars.sessionObj.stocks = {[refID] :{"price": qb.price, "amount": cost, "tier":qb.tier}};
						SessionModule.freeze(sessvars.sessionObj);
						updateSidebar(false);
						alertify.success(cost + " stocks purchased!");
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