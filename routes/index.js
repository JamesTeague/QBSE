exports.home = function(req, res){
	res.sendfile('index.html');
};
exports.market = function(req, res) {
	// console.log(path.join(__dirname+'../public/market.html'))
	res.sendfile('market.html', {root: '/public'});
};	