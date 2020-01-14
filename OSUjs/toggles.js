// functions for Fusion Tables
function hideFusion() {
  fusionLayer.setMap(null);
}

function showFusion() {
  map.data.setStyle({ visible: false });
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
function toggleBuildings(state) {
  map.data.setStyle({ visible: document.getElementById("buildings").checked });
}

function testOverlays() {
  if (document.getElementById('overlays').checked == true) { showOverlays(); }
  else { hideOverlays(); }
}

function testParking() {
  if (document.getElementById('parking').checked == true) { showParking(); }
  else { hideParking(); }
}