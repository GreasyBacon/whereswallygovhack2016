var main = function() {

	var cancelOutputButton = $("#cancelOutputButton");
	var generateOutputButton = $("#generateOutputButton");
	

	//clear table and return to upload form
	cancelOutputButton.click(function(event){

	});


	//generate json file from table and send to /visualise endpoint
	generateOutputButton.click(function(event){

		var data;

		$.ajax({
				url: '/visualise',
				data: data,
				cache: false, //api url won't be cached by server
				contentType: false, //already set contentType in form
				processData: false,
				type: 'POST', //we're posting this file
				success: function(data){
					

				},
				error: function(data, textStatus, errorThrown){

				}
			});


	})

};

$(document).ready(main());