var express = require('express');
var router = express.Router();

//added modules
var XLSX = require('xlsx');
var multer = require('multer');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/')
  },
  filename: function (req, file, cb) {
  	//creating unique name per upload
    cb(null, Math.random().toString(36).substring(7) + "." + file.originalname.split('.')[1])
  }
});
var upload = multer({ storage: storage });

router.post('/', upload.single('identityfile'), function(req, res, next) {

	//req.file is the 'identifyfile' file
	//req.body will hold the text fields if there were any

	if (req.file) {
		var filePath = req.file.path;
	}

	var workbook = XLSX.readFile(filePath);
	var firstSheetName = workbook.SheetNames[0];
	var worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[firstSheetName]);

	var columnHeadings = worksheet[0];
	var columns = [];

	var potentialSensitiveValues = ['dob', 'date of birth', 'name', 'address', 'age', 
									'birthday', 'race', 'religion', 'first_name', 'last_name',
									'email', 'e-mail', 'phone', 'mobile', 'first name', 'last name',
									'surname', 'given name', 'given names'];

	var potentialSensitiveCellValues = ['street', 'drive', 'lane', '@hotmail.com', '@gmail.com', '.com', 
										'avenue', '.com.au'];

	//returning 'true' or 'false'
	var checkValueSensitive = function(value) {

		if (potentialSensitiveValues.indexOf(value.toLowerCase()) != -1) {
			return true;
		}  else {
			return false;
		}

	};

	//returning 'true' or 'false'
	var checkContentSensitive = function(value) {


		for (var i=0; i<3; i++) {
			var row = worksheet[i];
			var content = row[value];

			for (var p=0; p<potentialSensitiveCellValues.length; p++) {
				if (content.toLowerCase().indexOf(potentialSensitiveCellValues[p]) != -1) {
					return true;
				}
			}
		}
		return false;

	};

	//returning 'string', 'number', 'date', ANY OTHERS?!?
	var checkValueType = function(value) {

		var numberCheck = Number(value);

		if (!isNaN(numberCheck)) {
			return 'number';
		}

		var currencyCheck = Number(value.replace("$", ""))

		if (!isNaN(currencyCheck)) {
			return 'currency';
		}

		var dateCheck = new Date(value);

		if (dateCheck != "Invalid Date") {
			return 'date';
		}

		return 'string';

	};

	//DOES NOT PUSH IF THE CELL IS EMPTY NOTE NOTE NOTE
	for (var heading in columnHeadings) {
		var config = {};
		config['name'] = heading;
		config['type'] = checkValueType(columnHeadings[heading]);
		config['sensitiveheading'] = checkValueSensitive(heading);
		config['sensitivecontents'] = checkContentSensitive(heading);
		columns.push(config);
	}

	//get first sheet
	//go through column names
	//return to user for configuration

	var filename = req.file.filename;

	res.json({
        'success': true,
        'fileName': filename, 
        'columns': columns,
        'statusMsg': "Upload completed."
     });

});

module.exports = router;
