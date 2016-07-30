var express = require('express');
var router = express.Router();
var XLSX = require('xlsx');

router.post('/', function(req, res) {
  

  	var filePath = 'uploads/' + req.body.filename;
  	var columns = req.body.columns;
  	var output = {
  		'visualisations': []
  	};

  	var workbook = XLSX.readFile(filePath);
  	var firstSheetName = workbook.SheetNames[0];
  	var worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[firstSheetName]);
	
  	//var outputWorkbook = new Workbook();
  	//var outputFilename = '/uploads/output-' + req.body.filename
  	//outputWorkbook.SheetNames.push("output");
  	//define ws as written sheet
  	//outputWorkbook.Sheets["output"] = ws;
  	//XLSX.writeFile(outputWorkbook, outputFilename);

  	var addToOutput = function(name, type, data) {
  		output['visualisations'].push({
  			'column': name,
  			'type': type,
  			'data': data
  		})
  	}

  	var visualiseCount = function(index, column) {

  		var tally = {};

  		for (var rowIndex in worksheet) {
  			var value = worksheet[rowIndex][column.column]
  			
  			if (value in tally) {
  				tally[value] += 1;
  			} else {
  				tally[value] = 1;
  			}

  		}

  		addToOutput(column.column, 'count', tally);
  	};

  	var visualiseUniqueCount = function(index, column) {

  		var tally = {};
  		var uniqueCount = 0;

  		for (var rowIndex in worksheet) {
  			var value = worksheet[rowIndex][column.column];

  			if (value in tally) {
  				tally[value] += 1;
  			} else {
  				tally[value] = 1;
  				uniqueCount += 1;
  			}
  		}

  		addToOutput(column.column, 'countunique', uniqueCount);

  	};

  	var visualiseAverage = function(index, column) {

  		var values = 0;
  		var count = 0;

  		for (var rowIndex in worksheet) {
  			var value = Number(worksheet[rowIndex][column.column]);
  			values += value;
  			count += 1;  			
  		}

  		var average = values / count;

  		addToOutput(column.column, 'average', average);

  	};

  	var visualiseRange = function(index, column) {

  	};

  	var visualiseMax = function(index, column) {

  		var max = 0;

  		for (var rowIndex in worksheet) {
  			var value = Number(worksheet[rowIndex][column.column]);
  			if (value > max) {
  				max = value;
  			}
  		}

  		addToOutput(column.column, 'max', max);

  	};

  	var visualiseMin = function(index, column) {

  		var min;

  		for (var rowIndex in worksheet) {
  			var value = Number(worksheet[rowIndex][column.column]);
  			if (!min < value) {
  				min = value;
  			}
  		}

  		addToOutput(column.column, 'min', min);

  	};

  	for (var i=0; i<columns.length; i++) {

  		var column = columns[i]

  		switch(column.visualisation) {
  			case 'none':
  				break
  			case 'count':
  				visualiseCount(i, column);
  				break
  			case 'countunique':
  				visualiseUniqueCount(i, column);
  				break
  			case 'average':
  				visualiseAverage(i, column);
  				break
  			case 'range':
  				visualiseRange(i, column);
  				break
  			case 'max':
  				visualiseMax(i, column);
  				break
  			case 'min':
  				visualiseMin(i, column);
  				break
  		}

  		switch(columns[i].remove) {
  			case true:
  				break
  			case false:
  				break
  		}

  		switch(columns[i].pseudonymise) {
  			case true:
  				break
  			case false:
  				break
  		}

  	};

  	//does it need to be added to new spreadsheet
  	//does it need to be psuedoified?
  	//does it need to be visualised

  	//count
  	//count unique
  	//average
  	//range
  	//max
  	//min

	res.json({
        'success': true,
        'output': output,
        'statusMsg': "Processing completed."
     });


});

module.exports = router;
