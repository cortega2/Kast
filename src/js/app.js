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

	app.controller('WeatherInfoCTRL', function ($scope){
		$scope.info = {};
		$scope.info.current = {};
		$scope.info.current.icon = "fa fa-camera-retro fa-5x";

		var weatherInfo = new WeatherInfo(key);

		$scope.$on('FoundLocation', function(event, data){
			weatherInfo.getCurrent(data.lat, data.lng, updateInfo);
			// getInfo(data.lat, data.lng);
		});

		function updateInfo (data){
			$scope.info.current = data.currently;
			$scope.info.current.icon = getIcon(data.currently.icon);
			// $scope.info.current.icon = "fa fa-ge fa-5x";
			$scope.$apply();
		};

		function getIcon(desc){
			var icon = "";
			switch(desc){
				case "clear-day":
					icon = "fa-sun-o";
					break;
				case "clear-night":
					icon = "fa-moon-o";
					break;
				case "rain":
					icon = "fa-tint"
					break;
				case "snow":
					icon = "fa-ge"
					break;
				case "sleet":
					icon = "fa-link"
					break;
				case "wind":
					icon = "fa-long-arrow-right"
					break;
				case "fog":
					icon = "fa-navicon";
					break;
				
				default:
					icon = "fa-cloud";
					break;
			};

			return "fa " + icon + " fa-5x";
		};

	});

	app.directive('weather', function (){
		return {
			restrict : 'E',
			templateUrl : './src/html/weather.html'
		};
	});

	 app.directive('weatherIcon', [function () {
        return {
            restrict: 'E',
            link: function (scope, element, attrs) {
            	var icon = angular.element("<i class="+ attrs.icon + "></i>");
                element.append(icon);
            }
        }
    }]);

})();