exports.home = function(req, res){
	var cwd = process.cwd();
	var indexFile = cwd + "/public/index.html";
	res.sendfile(indexFile, {"ipAddress": "127.0.0.1"});
};
exports.market = function(req, res) {
	var cwd = process.cwd();
    var marketFile = cwd + "/public/market.html";
    res.sendfile(marketFile);
};
exports.admin = function(req, res) {
	var cwd = process.cwd();
    var adminFile = cwd + "/public/admin.html";
    res.sendfile(adminFile);
};	
exports.myaccount = function(req, res) {
	var cwd = process.cwd();
    var myaccountFile = cwd + "/public/myaccount.html";
    res.sendfile(myaccountFile);
};	
exports.signup = function(req, res) {
	var cwd = process.cwd();
    var signupFile = cwd + "/public/signup.html";
    res.sendfile(signupFile);
};	