var express = require('express');
var XLSX = require('xlsx');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'De-Identify Your Data Inc.' });
});

module.exports = router;
