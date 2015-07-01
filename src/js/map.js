function LeafletMap(div){
	var div = div;
	var map;

	this.init = function(){
		map = L.map(div).setView([51.505, -0.09], 13);

		var layer = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
  			attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
		});

		map.addLayer(layer);
	}


}