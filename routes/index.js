var express = require('express');
var XLSX = require('xlsx');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

router.post('/api/upload/identifcationfile', function(req, res) {

	res.json({
        'success': true, 
        'errMsg': "Upload completed."
      });

});

module.exports = router;
