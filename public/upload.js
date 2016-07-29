var main = function() {

	window.onload = function() {

		var identificationUploadForm = $("#identificationForm");
		var identificationUploadButton = $("#uploadFileButton");
		var submitFileDiv = $("#submitFileDiv");
		var loadingImgDiv = $("#loadingImgDiv");
		var columnResultsDiv = $("#columnResultsDiv");
		var columnResultsTable = $("#columnResultsTable");
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

			if (column['sensitive']) {
				row = "<tr class='warning'>";
			}

			row = row + "<td>" + column['name'] + "</td><td>" + columnType + "</td><td>" + 
				  selectBoxAdd(column['type']) + "</td>";
					
			if (column['sensitive']) {
				row = row + "<td><input type='checkbox' checked></td>" +
					"<td><input type='checkbox' disabled></td></tr>";
			} else {
				row = row + "<td><input type='checkbox'></td>" +
				"<td><input type='checkbox'></td></tr>";
			}

			return row;

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

					for (var i=0; i<data.columns.length; i++){
						columnResultsTable.append(tableRowAdd(data.columns[i]));
					}

					//if there are inputs checked already (because sensitive was set to true on data value)
					if ($("input:checked").length) {
						sensitiveDataFoundAlert.show();
					}

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