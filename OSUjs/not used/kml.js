var geoxml = null;

function showOverlays() {
    geoXml = new geoXML3.parser({ map: map });
    geoXml.parse('OSUjs/kml.kml');
    geoXml.setOptions('preserveViewport', true);
}

function hideOverlays() {
    for (var i in geoXml.docs[0].gpolygons) {
        geoXml.docs[0].gpolygons[i].setMap(null);
    }
    for (var i in geoXml.docs[0].gpolylines) {
        geoXml.docs[0].gpolylines[i].setMap(null);
    }
}

var src = 'OSUjs/osu.kml';

var kmlLayer = new google.maps.KmlLayer(src, {
    suppressInfoWindows: true,
    preserveViewport: false,
    map: map
});

