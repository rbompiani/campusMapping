 // functions for Pamoramio Photos
function showPhotos() {
  panoramioLayer.setMap(map);
}

function hidePhotos() {
  panoramioLayer.setMap(null);
}


// functions for Fusion Tables
function hideFusion() {
  fusionLayer.setMap(null);
}

function showFusion() {
  fusionLayer.setMap(map);
}

function hideParking() {
  parkLayer.setMap(null);
}

function showParking() {
  parkLayer.setMap(map);
}

// functions for KML Layers
function showOverlays() {
  kmlLayer.setMap(map);
}

function hideOverlays() {
  kmlLayer.setMap(null);
}

// functions for Layers
function testBuilding() {
	if(document.getElementById('buildings').checked == true)
  { showFusion(); }
  else
  { hideFusion(); }
}

function testPhotos() {
	if(document.getElementById('photos').checked == true)
  { showPhotos(); }
  else
  { hidePhotos(); }
}

function testOverlays() {
	if(document.getElementById('overlays').checked == true)
  { showOverlays(); }
  else
  { hideOverlays(); }
}

function testParking() {
	if(document.getElementById('parking').checked == true)
  { showParking(); }
  else
  { hideParking(); }
}