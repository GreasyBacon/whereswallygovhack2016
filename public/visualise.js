var visualiseMain = function() {

	var cancelOutputButton = $("#cancelOutputButton");
	var generateOutputButton = $("#generateOutputButton");
	var columnResultsTable = $("#columnResultsTable");
	var graphVisualisationSection = $("#graphVisualisationSection");
	var columnResultsDiv = $("#columnResultsDiv");
	var loadingImgDiv = $("#loadingImgDiv");
	var uploadProcessSection = $("#uploadProcessSection");
	var downloadSpreadsheetButton = $("#downloadSpreadsheetButton");
	var graphAreaSection = $("#graphAreaSection");

	//clear table and return to upload form
	cancelOutputButton.click(function(event){

		//TO DO, RESET TABLE AND UPLOAD FORM

	});


	var createChart = function(name) {

		graphAreaSection.append('<div style="margin-top:4em" id="' + name +'"><h3>' + name +'</h3></div>');
		return "#" + name;

	};

	//options will always have 'column', 'data', 'type' variables
	var createCountVisualisation = function(options) {

		var chartName = createChart(options['column'] + '-count');
		var width = $(chartName).innerWidth();
		$(chartName).height(400);
		var data = [];

		for (var value in options['data']) {
			data.push({
				"value": options['data'][value],
				"name": value,
			});
		}

		var visualisation = d3plus.viz()
			.container(chartName)
			.data(data)
			.type("tree_map")
			.id("name")
			.size("value")
			.draw()

	};

	var createUniqueCountVisualisation = function(options) {

		var chartName = createChart(options['column'] + '-countunique');
		$(chartName).height(400);
		
		var data = [
			{"x": 1, "name": "Unique Count", "value": options['data']}
		];

		var visualisation = d3plus.viz()
			.container(chartName)
			.data(data)
			.type("bar")
			.id("name")
			.x("x")
			.y("value")
			.draw()
		
	};

	var createAverageVisualisation = function(options) {

		var chartName = createChart(options['column'] + '-average');
		$(chartName).height(400);
		
		var data = [
			{"x": 1, "name": "Average", "value": options['data']}
		];

		var visualisation = d3plus.viz()
			.container(chartName)
			.data(data)
			.type("bar")
			.id("name")
			.x("x")
			.y("value")
			.draw()

	};

	var createRangeVisualisation = function(options) {
		//data is 3 figures in array - min, max and range

		var chartName = createChart(options['column'] + '-range');

		var width = $(chartName).innerWidth();
		$(chartName).height(400);

		var data = [
			{'set': options['column'], 'name': 'min', 'value': options['data'][0]},
			{'set': options['column'], 'name': 'average', 'value': options['data'][2]},
			{'set': options['column'], 'name': 'max', 'value': options['data'][1]},
		];

		var visualisation = d3plus.viz()
			.container(chartName)
			.data(data)
			.type('box')
			.id('name')
			.x('set')
			.y('value')
			.draw()
	};

	var createMaxVisualisation = function(options) {

		var chartName = createChart(options['column'] + '-max');
		$(chartName).height(400);
		
		var data = [
			{"x":1, "name": "Maximum", "value": options['data']}
		]

		var visualisation = d3plus.viz()
			.container(chartName)
			.data(data)
			.type("bar")
			.id("name")
			.x("x")
			.y("value")
			.draw()

	};

	var createMinVisualisation = function(options) {

		var chartName = createChart(options['column'] + '-min');
		$(chartName).height(400);
		
		var data = [
			{"x":1, "name": "Minimum", "value": options['data']}
		]

		var visualisation = d3plus.viz()
			.container(chartName)
			.data(data)
			.type("bar")
			.id("name")
			.x("x")
			.y("value")
			.draw()
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

					graphVisualisationSection.append('<div style="margin-top:4em"><a href="uploads/' + window.FILENAME + 
						'" download="' + window.FILENAME + '"><button class="btn btn-primary"' +
						' style="float:right;">Download De-Identified Dataset</button></a>'
					);

					graphVisualisationSection.append('<button class="btn btn-primary" type="button" id="restartButton"' +
						' style="float:left;">Start with a new Dataset</button></div>');

					//start adding graphs
					if (data['output']['visualisations'].length == 0) {
						graphVisualisationSection.append('<p>No visualisations selected.</p>')
					} else {

						for (var i=0; i<data['output']['visualisations'].length; i++) {
							
							var visualisationOption = data['output']['visualisations'][i];

							switch(visualisationOption["type"]) {
								case 'count':
									createCountVisualisation(visualisationOption);
									break
								case 'countunique':
									createUniqueCountVisualisation(visualisationOption);
									break
								case 'average':
									createAverageVisualisation(visualisationOption);
									break
								case 'range':
									createRangeVisualisation(visualisationOption);
									break
								case 'max':
									createMaxVisualisation(visualisationOption);
									break
								case 'min':
									createMinVisualisation(visualisationOption);
									break
							}

						}

					}

				},
				error: function(data, textStatus, errorThrown){

				}
			});
	});


};