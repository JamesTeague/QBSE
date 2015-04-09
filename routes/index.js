var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
	res.sendfile('index.html');
});

router.get('/market', function (req, res) {
	res.sendfile('market.html')
})

module.exports = router;
