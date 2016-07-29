var main = function() {

	window.onload = function() {

		var identificationUploadForm = $("#identificationForm");
		var identificationUploadButton = $("#uploadFileButton");

		identificationUploadButton.click(function(event){
			identificationUploadForm.submit();
		});
	}

};


$(document).ready(main());