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


	});


	var createChart = function(name) {

		graphAreaSection.append('<div id="' + name +'"><h3>' + name +'</h3></div>');
		return "#" + name;

	};

	//options will always have 'column', 'data', 'type' variables
	var createCountVisualisation = function(options) {

		var chartName = createChart(options['column'] + '-count');



	};

	var createUniqueCountVisualisation = function(options) {

		var chartName = createChart(options['column'] + '-countunique');


	};

	var createAverageVisualisation = function(options) {

		var chartName = createChart(options['column'] + '-average');

	};

	var createRangeVisualisation = function(options) {
		//data is 3 figures in array - min, max and range

		var chartName = createChart(options['column'] + '-range');

		var width = $(chartName).innerWidth();
		var height = 200;

		var jsonCircles = [
   			{ "x_axis": width/4, "y_axis": 100, "radius": 25, "color" : "green"},
   			{ "x_axis": width/2, "y_axis": 100, "radius": 50, "color" : "purple"},
   			{ "x_axis": width-(width/4), "y_axis": 100, "radius": 75, "color" : "red"}
   		];
 
		var svgContainer = d3.select(chartName).append("svg")
                         .attr("width", width)
                         .attr("height", height);
		 
		var circles = svgContainer.selectAll("circle")
                      .data(jsonCircles)
                      .enter()
                      .append("circle");

		var circleAttributes = circles
                       .attr("cx", function (d) { return d.x_axis; })
                       .attr("cy", function (d) { return d.y_axis; })
                       .attr("r", function (d) { return d.radius; })
                       .style("fill", function(d) { return d.color; });

	};

	var createMaxVisualisation = function(options) {

		var chartName = createChart(options['column'] + '-max');

	};

	var createMinVisualisation = function(options) {

		var chartName = createChart(options['column'] + '-min');

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

					graphVisualisationSection.append('<button class="btn btn-primary" type="button" id="restartButton"' +
						' style="float:left;">Start with a new Dataset');

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