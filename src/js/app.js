(function (){
	var geocoder = new google.maps.Geocoder();
	var app = angular.module('skycast', ['ui.bootstrap']);

	app.controller('SearchCTRL', function($scope, $rootScope){
		$scope.selected = undefined;
		
		$scope.getLocation = function(){
			var input = document.getElementById('inputBox');
			
			geocoder.geocode( { 'address': input.value}, function(results, status) {
			    if (status == google.maps.GeocoderStatus.OK) {
			    	console.log(results);
			      // map.setCenter(results[0].geometry.location);
			      // var marker = new google.maps.Marker({
			      //     map: map,
			      //     position: results[0].geometry.location
			      // });
					input.value = results[0].formatted_address;

					$rootScope.$broadcast('FoundLocation', {
						lat: results[0].geometry.location.A,
						lng: results[0].geometry.location.F
					});
			    } 
			    else {
			      alert('Unable to find address: ' + status);
			    }
		  });
		};		
	});

	app.controller('MapCTRL', function($scope) {
		// var container = document.getElementById('mapLocation');

		var map = new LeafletMap('mapLocation')
		map.init();

		$scope.$on('FoundLocation', function(event, data){
			map.goTo(data.lat, data.lng);
		});
	});

})();