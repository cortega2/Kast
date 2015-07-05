function WeatherInfo(){
	this.getCurrent = function (lat, lng, callback){
		var link = 'requests.php?query=current&lat=' + lat + '&lng=' + lng;

		// var xmlHttp = new XMLHttpRequest();
		// xmlHttp.open( "GET", link, true );
		// xmlHttp.send( null );
		// console.log(xmlHttp);

	    d3.json(link, function(error, data){
	    	if(error){
	    		console.log(error);
	    	}
	    	else{
	    		console.log(data);
	    		callback(data);
	    	}
	    });
	}
}