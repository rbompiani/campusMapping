// Create a Google Closure slider bar which can be used to select the
// year by which to filter the geoJSON data.
function initializeSlider() {
	var sliderElement = document.getElementById('slider');
	slider = new goog.ui.Slider;
	slider.decorate(sliderElement);
	slider.addEventListener(goog.ui.Component.EventType.CHANGE, function () {
		// Avoid updating the map too often by ignoring slider value changes
		// that occur within 200mS of eachother.
		if (sliderTimer) window.clearTimeout(sliderTimer);
		sliderTimer = window.setTimeout(updateMap, 200);
		document.getElementById("slider-value").innerHTML = sliderValueToYr(slider.getValue());
	});
	slider.setValue(100);
}


// Convert a slider value (0 - 100%) to a year between 0 and 3000.
function sliderValueToYr(value) {
	return Math.round(value * 1.31 + 1889);
}


