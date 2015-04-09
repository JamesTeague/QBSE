var express = require('express');
var router = express.Router();

/* GET home page. */

exports.home = function (req, res) {
	res.sendfile('index.html');
};

exports.market = function (req, res) {
	res.sendfile('market.html');
};

module.exports = router;
