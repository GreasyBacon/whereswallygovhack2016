var visualiseMain = function() {

	var cancelOutputButton = $("#cancelOutputButton");
	var generateOutputButton = $("#generateOutputButton");
	var columnResultsTable = $("#columnResultsTable");
	var graphVisualisationSection = $("#graphVisualisationSection");
	var columnResultsDiv = $("#columnResultsDiv");
	var loadingImgDiv = $("#loadingImgDiv");
	var uploadProcessSection = $("#uploadProcessSection");
	var downloadSpreadsheetButton = $("#downloadSpreadsheetButton");

	//clear table and return to upload form
	cancelOutputButton.click(function(event){


	});

	var createCountVisualisation = function() {

	};

	var createUniqueCountVisualisation = function() {

	};

	var createAverageVisualisation = function() {

	};

	var createRangeVisualisation = function() {

	};

	var createMaxVisualisation = function() {

	};

	var createMinVisualisation = function() {

	};


	//generate json file from table and send to /visualise endpoint
	generateOutputButton.click(function(event){

		var config = {};

		config['filename'] = window.FILENAME;
		config['columns'] = [];

		var tableRows = columnResultsTable.find('tr');

		$.each(tableRows, function(index, value){

			if (value.className == 'header-row') {
				return;
			}

			config['columns'].push({
				'column': $(value).find('td')[0].innerText,
				'valueType': $(value).find('td')[1].innerText.toLowerCase(),
				'visualisation': $(value).find('select')[0].value,
				'remove': $(value).find('input')[0].checked,
				'pseudonymise': $(value).find('input')[1].checked
			});

		});

		columnResultsDiv.hide();
		loadingImgDiv.show();

		$.ajax({
				url: '/visualise',
				data: JSON.stringify(config),
				cache: false, //api url won't be cached by server
				dataType : "json",
    			contentType: "application/json; charset=utf-8",
 				type: 'POST', //we're posting this file
				success: function(data){

					window.FILENAME = data.file;

					loadingImgDiv.hide();
					uploadProcessSection.hide();
					graphVisualisationSection.show();

					graphVisualisationSection.append('<a href="uploads/' + window.FILENAME + 
						'" download="' + window.FILENAME + '"><button class="btn btn-primary"' +
						' style="float:right;">Download De-Identified Dataset</button></a>'
					);

					//start adding graphs
					if (data['output']['visualisations'].length == 0) {
						graphVisualisationSection.append('<p>No visualisations selected.</p>')
					} else {

						for (var i=0; i<data['output']['visualisations'].length; i++) {
							
							debugger;


						}

					}

				},
				error: function(data, textStatus, errorThrown){

				}
			});
	});


};