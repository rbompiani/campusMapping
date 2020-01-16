var walkingRadii = {};
var walkingCircle = new Array;

walkingRadii['library'] = {
  center: new google.maps.LatLng(44.56508, -123.27609),
  minutes: 5
};
walkingRadii['memorial union'] = {
  center: new google.maps.LatLng(44.564939, -123.278905),
  minutes: 5
};

function findWalks(){	
  for (var place in walkingRadii) {
    // Construct the circle for each value in walkingRadii. Scale the circle from walking time to distance.
    var walkingOptions = {
      strokeColor: "#5A5AFF",
      strokeOpacity: 0.8,
      strokeWeight: 0,
      fillColor: "#5A5AFF",
      fillOpacity: 0.15,
      //map: map,
      center: walkingRadii[place].center,
      radius: walkingRadii[place].minutes * (1609/20),
	  zIndex: -1
    };
    walkingCircle[place] = new google.maps.Circle(walkingOptions);
  }
}

function toggleWalking () {
    for (var place in walkingRadii) {
		if (walkingCircle[place].getMap()) {
			walkingCircle[place].setMap(null);		
		}
		else {
			walkingCircle[place].setMap(map);
		}
	}
}