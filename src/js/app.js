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

	// addapted from https://github.com/vicapow/angular-d3-talk
 	app.directive('donutChart', function(){
	 	function link(scope, el, attr){
		    var color = d3.scale.category10()
		    var data = scope.data

		    // quick check to make sure things don't break
		    if(data[0] == undefined){
		    	data = [.5,.5];
		    };

		    el = el[0]
		    var width = el.clientWidth
		    var height = el.clientHeight
		    var min = Math.min(width, height)
		    var pie = d3.layout.pie().sort(null)
		    var arc = d3.svg.arc()

		    var svg = d3.select(el).append('svg')
		    var g = svg.append('g')

		    // add the <path>s for each arc slice
		    var arcs = g.selectAll('path')

		    function arcTween(a) {
			    // see: http://bl.ocks.org/mbostock/1346410
			    var i = d3.interpolate(this._current, a);
			    this._current = i(0);
	    	 	return function(t) {
	       		return arc(i(t));
	      	};
	   	}

	    // svg.on('mousedown', function(){
	    //   scope.$apply(function(){
	    //     if(scope.onClick) scope.onClick()
	    //   })
	    // })

	    scope.$watch(function(){
	    	return el.clientWidth * el.clientHeight
	    }, function(){
	      width = el.clientWidth
	      height = el.clientHeight

	      min = Math.min(width, height)
	      arc.outerRadius(min / 2 * 0.9).innerRadius(min / 2 * 0.5)
	      arcs.attr('d', arc)

	      svg.attr({width: width, height: height})
	      g.attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')')
	    })

	    scope.$watch('data', function(dataPoints){
	    	//check to make sure things dont break
	    	var data = dataPoints;
	    	if(data[0] == undefined){
	    		data = [.5,.5];
	    	}

	    	console.log(data);

			var duration = 1000;

			arcs = arcs.data(pie(data));
			arcs.transition()
				.duration(duration)
				.attrTween('d', arcTween)

			arcs.enter()
				.append('path')
				.style('stroke', 'white')
				.attr('fill', function(d, i){ return color(i) })
				.each(function(d) {
				  this._current = { startAngle: 2 * Math.PI - 0.001, endAngle: 2 * Math.PI }
				})
				.transition()
				.duration(duration)
				.attrTween('d', arcTween)

			arcs.exit()
				.transition()
				.duration(duration)
				.each(function(d){ 
				  d.startAngle = 2 * Math.PI - 0.001; d.endAngle = 2 * Math.PI; 
				})
				.attrTween('d', arcTween).remove();
	    })

	  }
	  return {
	    link: link,
	    restrict: 'E',
	    scope: { data: '=', onClick: '=' }
	  }
	})

})();