function pieFactory(){
	var countText = encodeURIComponent("SELECT count(), 'Sub-sector', sum('Size') FROM "+tableid+" GROUP BY 'Sub-sector'");
	var countSubsects = new google.visualization.Query('http://www.google.com/fusiontables/gvizdata?tq='  + countText);
	countSubsects.send(searchPies);
}

function searchPies(response){
	var data=response.getDataTable();
	pieMap = new makePies(data);
	//pieMap.setMap(map);
}

function makePies(data) {
	this.data = data;
	this.pies_ = null;
}

makePies.prototype = new google.maps.OverlayView;

makePies.prototype.onAdd = function() {
	//determine number of subsectors
	var numRows = this.data.getNumberOfRows();
	
	//loop through each subsector
	for(var i = 0; i < numRows; i++) {
		//get value of subsector to use in query, and div # and sizing
		var temp = this.data.getValue(i,1);
		var temp2 = this.data.getValue(i,2);
		//scale pie chart according to gsf in sector
		scale_w = Math.round(temp2/6000);
		//set the query using the parameter
		var pieQueryText = encodeURIComponent("SELECT 'Use', sum('Size') FROM "+tableid+" WHERE 'Sub-sector' = '"+temp+ "' GROUP BY 'Use'");
		var pieSubsects = 'http://www.google.com/fusiontables/gvizdata?tq='  + pieQueryText;
		var sendOff = new google.visualization.Query(pieSubsects);
		sendOff.send(determineColors);
		
		//create a div and name it for each subsector, attach to map
		//var ni = document.getElementById('map_canvas');
		pieDivs[temp] = document.createElement('div');
		var divIdName = 'sector'+temp+'Pie';
		pieDivs[temp].setAttribute('id',divIdName);
		pieDivs[temp].style.position = 'absolute';
		//ni.appendChild(pieDivs[temp]);
		
		var panes = this.getPanes();
		panes.overlayLayer.appendChild(pieDivs[temp]);
		var projection = this.getProjection();
		//var position = projection.fromLatLngToDivPixel(new google.maps.LatLng(data.getValue(row, 2), data.getValue(row, 3)));
		var position = projection.fromLatLngToDivPixel(new google.maps.LatLng(44.5685, -123.282));
		//alert(position);
		
		if (temp=="C2"){
		google.visualization.drawChart({
			"containerId": divIdName,
			"dataSourceUrl": pieSubsects,
			"chartType": "PieChart",
			"options": {
				"width": scale_w,
				"height" : scale_w,
				"legend" : 'none',
				"backgroundColor" : 'transparent',
				"colors" : ['#70C7D4','#CDD00A','#FA7236','#C2361D','#AB6B90']
			}
		});
		position = projection.fromLatLngToDivPixel(zone2center);
		}		
		else if (temp=="C3"){
		google.visualization.drawChart({
			"containerId": divIdName,
			"dataSourceUrl": pieSubsects,
			"chartType": "PieChart",
			"options": {
				"width": scale_w,
				"height" : scale_w,
				"legend" : 'none',
				"backgroundColor" : 'transparent',
				"colors" : ['#666666','#70C7D4','#CDD00A','#FA7236','#AB6B90']
			}
		});
		position = projection.fromLatLngToDivPixel(zone3center);
		}
		else if(temp=="D2"){
		google.visualization.drawChart({
			"containerId": divIdName,
			"dataSourceUrl": pieSubsects,
			"chartType": "PieChart",
			"options": {
				"width": scale_w,
				"height" : scale_w,
				"legend" : 'none',
				"backgroundColor" : 'transparent',
				"colors" : ['#CDD00A','#AB6B90']
			}
		});
		position = projection.fromLatLngToDivPixel(zone4center);
		}
		else{
		google.visualization.drawChart({
			"containerId": divIdName,
			"dataSourceUrl": pieSubsects,
			"chartType": "PieChart",
			"options": {
				"width": scale_w,
				"height" : scale_w,
				"legend" : 'none',
				"backgroundColor" : 'transparent',
				"colors" : ['#FA7236','#C2361D','#AB6B90','#70C7D4','#CDD00A']
			}
		});
		}
		pieDivs[temp].style.top = position.y-(scale_w / 2)+'px';
		pieDivs[temp].style.left = position.x-(scale_w / 2)+'px';
		pieDivs[temp].style.zIndex=100;
		
	}
	this.pies_ = pieDivs;	
}


makePies.prototype.draw = function() {
};

makePies.prototype.onRemove = function() {
  var total = this.pies_.length;
  for (i=1; i < total; i++){
	this.pies_[i].parentNode.removeChild(this.pies_[i]);
	this.pies_[i]= null;
	}
}

makePies.prototype.toggle = function() {
	if (this.getMap()) {
		this.setMap(null);
		
	}
	else {
		this.setMap(map);
	}
};



function determineColors (response){

	var numRows = response.getDataTable().getNumberOfRows();
	var styleColors = new Array();
	var usage;
	//loop through each use
	for(var i = 0; i <numRows; i++) {
		usage = response.getDataTable().getValue(i,0);
		if (usage == 'Instructional'){
			styleColors.push("'#FA7236'");
		}
		else if( usage == 'Research'){
			styleColors.push("'#C2361D'");
		}
		else if( usage == 'Support Services'){
			styleColors.push("'#AB6B90'");
		}
		else if( usage == 'Athletics'){
			styleColors.push("'#70C7D4'");
		}
		else {
			styleColors.push("'#CDD00A'");
		}
	}
	var stylized = "[" +styleColors.join(",")+ "]";
	return stylized;
}