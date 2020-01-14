//update buildings based on sub-sector selection
function changeMap() {
	slider.setValue(100);
	var searchString = document.getElementById('searchString').value.replace("'", "\\'");
	if (searchString == "") {
		fusionLayer.setOptions({
			'query': {
				select: 'geometry',
				from: tableid
			}
		});
		//set the query using the parameter
		var queryText = encodeURIComponent("SELECT 'Building Name', 'Construction', 'Size' FROM " + tableid);
		var query = new google.visualization.Query('http://www.google.com/fusiontables/gvizdata?tq=' + queryText);
		//set the callback function
		query.send(getData);
		document.getElementById("selectTitle").innerHTML = "Buildings Located in Sectors C & D";
		return;
	}
	fusionLayer.setOptions({
		'query': {
			select: 'geometry',
			from: tableid,
			where: "'Sub-sector' = '" + searchString + "'"
		}
	});
	//set the query using the parameter
	var queryText = encodeURIComponent("SELECT 'Building Name', 'Construction', 'Size' FROM " + tableid + " WHERE 'Sub-sector' LIKE '" + searchString + "'");
	var query = new google.visualization.Query('http://www.google.com/fusiontables/gvizdata?tq=' + queryText);

	//set the callback function
	query.send(getData);

	document.getElementById("selectTitle").innerHTML = "Buildings Located in Zone " + searchString;
}

function changeData(subsect) {
	//set the query using the parameter
	var queryText = encodeURIComponent("SELECT 'Building Name', 'Construction', 'Size' FROM " + tableid + " WHERE 'Sub-sector' LIKE '" + subsect + "'");
	var query = new google.visualization.Query('http://www.google.com/fusiontables/gvizdata?tq=' + queryText);

	//set the callback function
	query.send(getData);
}

//define callback function, this is called when the results are returned
function getData(response) {
	//for more information on the response object, see the documentation
	//http://code.google.com/apis/visualization/documentation/reference.html#QueryResponse
	numRows = response.getDataTable().getNumberOfRows();
	numCols = response.getDataTable().getNumberOfColumns();

	//concatenate the results into a string
	fusiontabledata = "<table id='table'>"
	var bldgAges = new Array();
	var bldgSizes = new Array();
	for (i = 0; i < numRows; i++) {
		fusiontabledata += "<tr>"
		for (j = 0; j < numCols; j++) {
			fusiontabledata += "<td>" + response.getDataTable().getValue(i, j) + "</td>";

		}
		var temp = response.getDataTable().getValue(i, 1);
		if (temp > 0) {
			var temp2 = currentYear - temp;
			bldgAges.push(temp2);
		}
		var temp3 = response.getDataTable().getValue(i, 2);
		bldgSizes.push(temp3);

		var totalGSF = bldgSizes.ttl() + " gsf";
		var avgAge = bldgAges.avg() + " years";
		fusiontabledata += "</tr>";
	}
	fusiontabledata += "</table>"

	//add the data to the page via innerHTML
	document.getElementById('bldgList').innerHTML = fusiontabledata;
	document.getElementById('summary').innerHTML = "<table id='bldgSummary'><tr><td>Number of Buildings:</td><td>" + numRows + "</td></tr><tr><td>Average Age:</td><td>" + avgAge + "</td></tr><tr><td> Total Building Area:</td><td>" + totalGSF + "</td></tr></table><br/>";
}

function updateBuildingList(buildList) {
	let buildingData = "<table id='buildingTable'>";
	let bldgAges = [];
	let totalGsf;
	console.log("props passed in are...", buildList);
	buildList.forEach(build => {
		console.log("we found a building", build);
		// create table rows
		buildingData += "<tr>";
		buildingData += "<td>" + build.name + "</td>";
		buildingData += "<td>" + build.year + "</td>";
		buildingData += "<td>" + build.gsf + "</td>";
		buildingData += "</tr>";

		// add to building age array
		bldgAges.push(build.year);

		// add to total gsf
		totalGsf += build.gsf;
	})

	buildingData += "</table>";
	console.log(buildingData);

	// find average age
	//let ageTotal = bldgAges.reduce((previous, current) => current += previous);
	//let avgAge = ageTotal / bldgAges.length;

	//add the data to the page via innerHTML
	//document.getElementById('bldgList').innerHTML = fusiontabledata;
	//document.getElementById('summary').innerHTML = "<table id='bldgSummary'><tr><td>Number of Buildings:</td><td>" + bldgAges.length + "</td></tr><tr><td>Average Age:</td><td>" + avgAge + "</td></tr><tr><td> Total Building Area:</td><td>" + totalGsf + "</td></tr></table><br/>";

}
