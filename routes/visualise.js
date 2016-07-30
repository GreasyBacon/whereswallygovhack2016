var express = require('express');
var router = express.Router();
var XLSX = require('xlsx');

router.post('/', function(req, res) {
  

  	var filePath = 'public/uploads/' + req.body.filename;
  	var columns = req.body.columns;
  	var output = {
  		'visualisations': []
  	};

  	var workbook = XLSX.readFile(filePath);
  	var firstSheetName = workbook.SheetNames[0];
  	var worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[firstSheetName]);
	
  	//var outputWorkbook = new XLSX.Workbook();
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
  			var value = Number(worksheet[rowIndex][column.column].replace("$", ""));
  			if (!isNaN(value)){
  				values += value;
  				count += 1;
  			}  			
  		}

  		var average = Math.round(values / count);

  		addToOutput(column.column, 'average', average);

  	};

  	var visualiseRange = function(index, column) {

  		var max = 0,
  			min,
  			range;
  		
  		for (var rowIndex in worksheet) {
  			var value = Number(worksheet[rowIndex][column.column].replace("$", ""));
  			if (!min < value) {
  				min = value;
  			}
  			if (value > max) {
  				max = value;
  			}
  		}

  		range = max - min;

  		addToOutput(column.column, 'range', [min, max, range])

  	};

  	var visualiseMax = function(index, column) {

  		var max = 0;

  		for (var rowIndex in worksheet) {
  			var value = Number(worksheet[rowIndex][column.column].replace("$", ""));
  			if (value > max) {
  				max = value;
  			}
  		}

  		addToOutput(column.column, 'max', max);

  	};

  	var visualiseMin = function(index, column) {

  		var min;

  		for (var rowIndex in worksheet) {
  			var value = Number(worksheet[rowIndex][column.column].replace("$", ""));
  			if (!min < value) {
  				min = value;
  			}
  		}

  		addToOutput(column.column, 'min', min);

  	};

  	var generateXLSXFile = function(data, filename) {

	  	/*https://gist.github.com/SheetJSDev/88a3ca3533adf389d13c*/
	  	function datenum(v, date1904) {
			if(date1904) v+=1462;
			var epoch = Date.parse(v);
			return (epoch - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000);
		}	

		function sheet_from_array_of_arrays(data, opts) {
			var ws = {};
			var range = {s: {c:10000000, r:10000000}, e: {c:0, r:0 }};
			for(var R = 0; R != data.length; ++R) {
				for(var C = 0; C != data[R].length; ++C) {
					if(range.s.r > R) range.s.r = R;
					if(range.s.c > C) range.s.c = C;
					if(range.e.r < R) range.e.r = R;
					if(range.e.c < C) range.e.c = C;
					var cell = {v: data[R][C] };
					if(cell.v == null) continue;
					var cell_ref = XLSX.utils.encode_cell({c:C,r:R});
					
					if(typeof cell.v === 'number') cell.t = 'n';
					else if(typeof cell.v === 'boolean') cell.t = 'b';
					else if(cell.v instanceof Date) {
						cell.t = 'n'; cell.z = XLSX.SSF._table[14];
						cell.v = datenum(cell.v);
					}
					else cell.t = 's';
					
					ws[cell_ref] = cell;
				}
			}
			if(range.s.c < 10000000) ws['!ref'] = XLSX.utils.encode_range(range);
			return ws;
		}

		/* original data */
		var ws_name = "De-Identified Data";

		function Workbook() {
			if(!(this instanceof Workbook)) return new Workbook();
			this.SheetNames = [];
			this.Sheets = {};
		}

		var wb = new Workbook(), ws = sheet_from_array_of_arrays(data);

		wb.SheetNames.push(ws_name);
		wb.Sheets[ws_name] = ws;
		XLSX.writeFile(wb, 'public/uploads/' + filename);
		/*https://gist.github.com/SheetJSDev/88a3ca3533adf389d13c*/
  	}

  	var allColumnHeaders = [];
  	var columnsToKeep = [];
  	var columnsToPseudonymise = [];
  	var spreadsheetArray = [];

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

  		switch(column.remove) {
  			case true:
  				//not going to be used
  				break
  			case false:
  				if (column.pseudonymise) {
  					columnsToPseudonymise.push(column.column);
  				} else {
  					columnsToKeep.push(column.column);
  				}
  				allColumnHeaders.push(column.column);
  				break
  		}

  	};

  	//get headers in spreadsheet
  	spreadsheetArray.push(allColumnHeaders);

  	for (var rowIndex in worksheet) {

		var cellObject = worksheet[rowIndex];
		var cellValues = [];

		for (var i=0; i<allColumnHeaders.length; i++) {
			var column = allColumnHeaders[i];
			var val = cellObject[column] || ''; //account for blank cells
			if (columnsToKeep.indexOf(column) == -1 && columnsToPseudonymise.indexOf(column) == -1) {
				delete val;
			} else if (columnsToPseudonymise.indexOf(column) !== -1) {
				val = require('crypto').createHash('md5').update(val).digest("hex");
				cellValues.push(val);
			} else {
				cellValues.push(val);
			}
		}

		spreadsheetArray.push(cellValues);

	}

	generateXLSXFile(spreadsheetArray, 'de-identified-' + req.body.filename)

	res.json({
        'success': true,
        'output': output,
        'file': 'de-identified-' + req.body.filename,
        'statusMsg': "Processing completed."
     });


});

module.exports = router;
