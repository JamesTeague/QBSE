exports.home = function(req, res){
	res.sendfile('index.html');
};
exports.market = function(req, res) {
	res.sendfile(path.resolve(__dirname+'../public/market.html'));
};	