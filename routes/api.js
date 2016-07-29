var express = require('express');
var XLSX = require('xlsx');
var router = express.Router();

router.post('/upload/identifcationfile', function(req, res) {

	res.json({
        'success': true, 
        'errMsg': "Upload completed."
      });

});

module.exports = router;
