var main = function() {

	//global variable to handle filename of uploaded file throughout process;
	//ideally with a cookie or passing through functions
	//but ain't nobody got time for that!
	window.FILENAME = '';

	window.onload = function() {

		var identificationUploadForm = $("#identificationForm");
		var identificationUploadButton = $("#uploadFileButton");
		var submitFileDiv = $("#submitFileDiv");
		var loadingImgDiv = $("#loadingImgDiv");
		var columnResultsDiv = $("#columnResultsDiv");
		var columnResultsTable = $("#columnResultsTable");
		var deleteDataRecommendationAlert = $("#deleteDataRecommendationAlert");
		var sensitiveDataFoundAlert = $("#sensitiveDataFoundAlert");

		$('[data-toggle="tooltip"]').tooltip({
		    container : 'body'
		});

		var selectBoxAdd = function(type) {

			if (type == 'number') {
				return "<select>" +
					"<option value='none'>(none)</option>" +
					"<option value='count'>Count</option>" +
	  				"<option value='countunique'>Count (Unique)</option>" +
	  				"<option value='average'>Average</option>" +
	  				"<option value='range'>Range</option>" +
	  				"<option value='max'>Max</option>" +
	  				"<option value='min'>Min</option>" +
					"</select>"
			}

			if (type == 'string' || type == 'date') {
				return "<select>" +
					"<option value='none'>(none)</option>" +
					"<option value='count'>Count</option>" +
	  				"<option value='countunique'>Count (Unique)</option>" +
					"</select>"
			}

		};

		//not done the most efficient way, but this is a 'govHACK'
		var tableRowAdd = function(column) {

			var columnType = column['type'].charAt(0).toUpperCase() + column['type'].slice(1),
				row = "<tr>";

			if (column['sensitivecontents']) {
				row = "<tr class='warning'>";
			}

			if (column['sensitiveheading']) {
				row = "<tr class='danger'>";
			}

			row = row + "<td>" + column['name'] + "</td><td>" + columnType + "</td><td>" + 
				  selectBoxAdd(column['type']) + "</td>";
					
			if (column['sensitiveheading']) {
				row = row + "<td><input name='remove' type='checkbox' checked></td>" +
					"<td><input name='pseudonymise' type='checkbox' disabled></td></tr>";
			} else if (column['sensitivecontents']) {
				row = row + "<td><input name='remove' type='checkbox' disabled></td>" +
					"<td><input name='pseudonymise' type='checkbox' checked></td></tr>";
			} else {
				row = row + "<td><input name='remove' type='checkbox'></td>" +
				"<td><input name='pseudonymise' type='checkbox'></td></tr>";
			}

			return row;

		};

		var addCheckboxChangeListeners = function() {

			$("input[name='remove']").change(function() {
				var el = $(event.currentTarget.parentElement.parentElement).find("input[name='pseudonymise']")[0]
				if (this.checked) {
					el.setAttribute('disabled', 'disabled')
				} else {
					el.removeAttribute('disabled')
				}
			});

			$("input[name='pseudonymise']").change(function() {
				var el = $(event.currentTarget.parentElement.parentElement).find("input[name='remove']")[0]
				if (this.checked) {
					el.setAttribute('disabled', 'disabled')
				} else {
					el.removeAttribute('disabled')
				}
			});			

		};

		identificationUploadForm.submit(function(event){

			event.preventDefault();

			var url = this.attributes.action.value;
			var data = new FormData(this);

			loadingImgDiv.show();
			submitFileDiv.hide();

			$.ajax({
				url: url,
				data: data,
				cache: false, //api url won't be cached by server
				contentType: false, //already set contentType in form
				processData: false,
				type: 'POST', //we're posting this file
				success: function(data){
					
					loadingImgDiv.hide();
					columnResultsDiv.show();

					window.FILENAME = data.fileName;

					for (var i=0; i<data.columns.length; i++){
						columnResultsTable.append(tableRowAdd(data.columns[i]));
					}

					//if there are inputs checked already (because sensitive was set to true on data value)
					if ($("input[name='remove']:checked").length) {
						deleteDataRecommendationAlert.show();
					}

					if ($("input[name='pseudonymise']:checked").length) {
						sensitiveDataFoundAlert.show();
					}

					addCheckboxChangeListeners();

					visualiseMain();

					//if any contain sensitive, should add warning message saying 'these columns should be removed or obfuscated'

				},
				error: function(data, textStatus, errorThrown){

				}
			});	


		});


		identificationUploadButton.click(function(event){
			identificationUploadForm.submit();
		});
	}

};


$(document).ready(main());