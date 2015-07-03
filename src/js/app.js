(function (){
	//not good for security reasons
	var key = '6abe4e7b27660bcdd224e6052db73686';
	
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

	app.controller('WeatherInfoCTRL', function ($scope, $http){
		var weatherInfo = new WeatherInfo(key);

		$scope.$on('FoundLocation', function(event, data){
			weatherInfo.getCurrent(data.lat, data.lng, updateInfo);
			// getInfo(data.lat, data.lng);
		});

		function updateInfo (info){
			console.log(info);
		};

		function getInfo(lat, lng){
			// var link = 'https://api.forecast.io/forecast/' + key +'/'+ lat +',' + lng + '&callback=JSON_CALLBACk';

			// $http.jsonp(link).
			//     success(function(data) {
			//     	console.log(data);
			//     }).
			//     error(function(data, status) {
			//         $scope.error = true
			//         console.log(status);
			//     });
		}

	});

})();