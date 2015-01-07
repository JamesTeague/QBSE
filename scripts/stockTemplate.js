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
ref.child("qb").once("value", function(s) { 
	_.each(s.val(), function(e,k,l){
		qbList.push({name: k, price: e.price, tier: e.tier})
	});
	$("#stocks").html(template({qbs: qbList}));
});

