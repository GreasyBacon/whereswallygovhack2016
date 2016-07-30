var visualiseMain = function() {

	var cancelOutputButton = $("#cancelOutputButton");
	var generateOutputButton = $("#generateOutputButton");
	var columnResultsTable = $("#columnResultsTable");

	//clear table and return to upload form
	cancelOutputButton.click(function(event){

	});


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

		$.ajax({
				url: '/visualise',
				data: JSON.stringify(config),
				cache: false, //api url won't be cached by server
				dataType : "json",
    			contentType: "application/json; charset=utf-8",
 				type: 'POST', //we're posting this file
				success: function(data){
					

				},
				error: function(data, textStatus, errorThrown){

				}
			});


	})
};