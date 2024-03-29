function LeafletMap(div){
	var div = div;
	var map;

	this.init = function(){
		// map = L.map(div).setView([51.505, -0.09], 10);

		//normal tiles
		baseLayer = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
  			attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
		});

		//radar tiles
        // var radar = L.tileLayer('http://{s}.tile.openweathermap.org/map/precipitation/{z}/{x}/{y}.png', {attribution: 'Map data © OpenWeatherMap'});


		map = L.map(div, {
		    center: [41.83, -87.68],
		    zoom: 10,
		    layers: [ baseLayer]
		});

		var tiles = {
			"Normal" : baseLayer
		};

		// var overLays = {
		// 	"Precipitation" : radar
		// };

		L.control.layers(tiles).addTo(map);
	};

	this.goTo = function (lat, lng){
		map.setView([lat,lng], 10, {pan : {animate : true, duration : 1}});
	};


}