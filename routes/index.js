exports.home = function(req, res){
	res.sendfile('index.html');
};
exports.market = function(req, res) {
	var cwd = process.cwd();
    var marketFile = cwd + "public/market.html";
    res.sendfile(marketFile);
};	