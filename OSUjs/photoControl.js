function photoClicked(event) {

	var wapiblock = document.getElementById('info');

	var myRequest = {
		ids: [{
			'photoId': event.featureDetails.photoId,
			'userId': 5852503
		}]
	};
		
	var myOptions = {
		'width': 300,
		'height': 200,
		'attributionStyle': panoramio.tos.Style.HIDDEN,
		'disableDefaultEvents' : true
	};
	
	var widget = new panoramio.PhotoWidget(wapiblock, myRequest, myOptions);
	widget.setPosition(0);
	widget.enableNextArrow(false);
	widget.enablePreviousArrow(false);
	var terms = document.getElementById('terms');
	var block = new panoramio.TermsOfServiceWidget('terms');
	
}	