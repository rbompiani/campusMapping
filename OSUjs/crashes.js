var crashMarkers = new Array;

//generate and send crash question
function askCrashes() {
	
	//set the query using the parameter
	var queryText = encodeURIComponent("SELECT 'Intersection / Segment', 'Number', 'Map Lat', 'Map Lng' FROM " +crashid);
	
	var query = new google.visualization.Query('http://www.google.com/fusiontables/gvizdata?tq='  + queryText);
	//set the callback function
	query.send(getCrashes);
	
}

function getCrashes(response){
	numRows = response.getDataTable().getNumberOfRows();
	
	for(var i = 0; i < numRows; i++) {
		//get value of subsector to use in query, and div # and sizing
		var crashNum = response.getDataTable().getValue(i, 1);
		var lat= parseFloat(response.getDataTable().getValue(i, 2));
		var lng= response.getDataTable().getValue(i, 3);
		var crashLoc = new google.maps.LatLng(lat, lng);
		//scale circle chart according to crashes
		var scale = crashNum*10;
		var crashOptions = {
			strokeColor: "#5A5AFF",
			strokeOpacity: 0.8,
			strokeWeight: 0,
			fillColor: "#CC0000",
			fillOpacity: 0.5,
			//map: map,
			center: crashLoc,
			radius: scale,
			zIndex: -1
		};
		
		crashMarkers[i] = new google.maps.Circle(crashOptions);
		
	}			
}	

function toggleCrashes () {
    var len = crashMarkers.length;
	for (i=0; i<len; i++) {
		if (crashMarkers[i].getMap()) {
			crashMarkers[i].setMap(null);		
		}
		else {
			crashMarkers[i].setMap(map);
		}
	}
}