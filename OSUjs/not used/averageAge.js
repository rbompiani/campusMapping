	
// Working average function
function newAverage(){
	Array.prototype.avg = function() {
		var av = 0;
		var cnt = 0;
		var len = this.length;
		for (var i = 0; i < len; i++) {
			var e = +this[i];
			if(!e && this[i] !== 0 && this[i] !== '0') e--;
			if (this[i] == e) {av += e; cnt++;}
		}
	return Math.round(av/cnt);
	}
}

function newTotal(){
	Array.prototype.ttl = function() {
		var tot = 0;
		var len = this.length;
		for (var i = 0; i < len; i++) {
			var e = +this[i];
			tot += e;
		}
	newtot = Math.round(tot);
	return addCommas(newtot);
	}
}

function addCommas(nStr)
	{
	nStr += '';
	x = nStr.split('.');
	x1 = x[0];
	x2 = x.length > 1 ? '.' + x[1] : '';
	var rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)) {
		x1 = x1.replace(rgx, '$1' + ',' + '$2');
	}
	return x1 + x2;
}

