var express = require('express');
var XLSX = require('xlsx');
var router = express.Router();
var path = require('path');


router.post('/', function(req, res) {

	console.log(req.body);

	var file = path.join(__dirname, '..', 'public/uploads', req.body.filename)
	res.download(file);
  
});

module.exports = router;
