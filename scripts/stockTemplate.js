var ref = new Firebase("https://qb-stock-exchange.firebaseio.com/");
var qbList = [];
var source = $("#stockTemplate").html();
var template = Handlebars.compile(source);
ref.child("qb").once("value", function(s) { 
	_.each(s.val(), function(e,k,l){
		qbList.push({name: k, price: e.price, tier: e.tier})
	});
	$("#stocks").html(template({qbs: qbList}));
});

