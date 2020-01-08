//update buildings based on Program
function whatsup() {	
	fusionLayer.setOptions({
		'query': {
			select: 'geometry',
			from: tableid,
			where: "'Program' CONTAINS 'College of Science'"}
	});
}