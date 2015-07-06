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
	    		callback(data);
	    	}
	    });
	}

	this.getPast = function (lat, lng, date, callback){
		var link = 'requests.php?query=past&lat=' + lat + '&lng=' + lng +'&date=' + date;

	    d3.json(link, function(error, data){
	    	if(error){
	    		console.log(error);
	    	}
	    	else{
	    		callback(data);
	    	}
	    });
	}
}