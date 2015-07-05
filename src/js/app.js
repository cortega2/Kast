(function (){
    var geocoder = new google.maps.Geocoder();
    var app = angular.module('skycast', ['ui.bootstrap']);

    app.controller('SearchCTRL', function($scope, $rootScope){
        $scope.selected = undefined;
        
        $scope.getLocation = function(){
            var input = document.getElementById('inputBox');
            
            geocoder.geocode( { 'address': input.value}, function(results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
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

        var weatherInfo = new WeatherInfo();

        $scope.$on('FoundLocation', function(event, data){
            weatherInfo.getCurrent(data.lat, data.lng, updateInfo);
            // getInfo(data.lat, data.lng);
        });

        function updateInfo (data){
            $scope.info.current = data.currently;
            $scope.info.hourly = data.hourly;
            $scope.info.current.icon = getIcon(data.currently.icon);
            // $scope.info.current.icon = "fa fa-ge fa-5x";
            $scope.$apply();
        };

        $scope.testClick = function(){
            console.log("clicked");
        }

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

    app.directive('weatherIcon', function () {
        return {
            restrict: 'E',
            link: function (scope, element, attrs) {
                var icon = angular.element("<i class="+ attrs.icon + "></i>");
                element.append(icon);
            }
        }
    });

    // addapted from https://github.com/vicapow/angular-d3-talk
    app.directive('donutChart', function(){
        function link(scope, el, attr){
            var color = d3.scale.category10();
            var data = scope.data;
            var icon = scope.icon;

            // quick check to make sure things don't break
            if(data[0] == undefined){
                data = [.5,.5];
            };

            el = el[0];
            var width = el.clientWidth;
            var height = el.clientHeight;
            var min = Math.min(width, height);
            var pie = d3.layout.pie().sort(null);
            var arc = d3.svg.arc();

            var svg = d3.select(el).append('svg');
            var textElems = svg.append('g');
            var g = svg.append('g');

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

            scope.$watch(function(){
                return el.clientWidth * el.clientHeight
            }, function(){
              width = el.clientWidth
              height = el.clientHeight

              min = Math.min(width, height)
              arc.outerRadius(min / 2 * 0.7).innerRadius(min / 2 * 0.6)
              arcs.attr('d', arc)

              svg.attr({width: width, height: height})
              g.attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')')
            });

            scope.$watch('data', function(dataPoints){
                //check to make sure things dont break
                var data = dataPoints;
                if(data[0] == undefined){
                    data = [.5,.5];
                }

                var duration = 1000;

                svg.selectAll("text").remove();


                textElems.append('text')
                    .attr('font-family', 'FontAwesome')
                    .attr('font-size', "40px" )
                    .attr('x', '50%')
                    .attr('y', '50%')
                    .style("text-anchor", "middle")
                    .text(function(d) {
                        if(icon == "cloud")
                            return '\uf0c2';
                        else if (icon == "drop")
                            return '\uf043';
                        else
                            return '\uf1c5';
                     }); 

                textElems.append('text')
                    .attr('font-family', 'sans-serif')
                    .attr('font-size', "30px" )
                    .attr('x', '50%')
                    .attr('y', '65%')
                    .style("text-anchor", "middle")
                    .text(function(d) {
                        return Math.round(data[0] * 100) + "%";
                     });

                 textElems.append('text')
                    .attr('font-family', 'sans-serif')
                    .attr('font-size', "20px" )
                    .attr('x', '50%')
                    .attr('y', '95%')
                    .style("text-anchor", "middle")
                    .text(function(d) {
                        if(icon == "cloud")
                            return 'Cloud Coverage';
                        else if (icon == "drop")
                            return 'Humidity';
                        else
                            return '\uf1c5';
                     }); 

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
        scope: { data: '=', onClick: '=', icon: '='}
      }
    })

    // based on the directive above and some of my old code from a prev project
    app.directive('plotGraph', function(){
        function link(scope, el, attr){
            var el = el[0];
            var width = el.clientWidth;
            var height = el.clientHeight;

            var dataObject = scope.data;
            var labels = scope.labels;
            var value = scope.value;
            var title = scope.title;
            var percentage = scope.percentage;

            var dx = 80;
            var dy = 80;

            var colors = scope.colors;

            var drawSection = d3.select(el).append('svg')
                .attr("width", width)
                .attr("height", height);


            var graph = drawSection.append("g");

            scope.$watch(function() {
                return el.clientWidth * el.clientHeight
            }, function(){
                width = el.clientWidth
                height = el.clientHeight

                drawSection.attr({width: width, height: height});
                graph.attr('transform', 'translate(' + width/2 + ',' + height/2+ ')')
            })

            scope.$watch('data', function(dataPoints){
                // quick check, not to break things
                if(dataPoints == undefined)
                    return;

                // couldn't get update to work properly, this will have to do for the prototype
                graph.selectAll('*').remove();

                var max = 0;
                var min = 1000;

                for (var i = 0; i < dataPoints.length; i++) {
                    if (percentage) {
                        dataPoints[i][value] = Math.round(dataPoints[i][value] * 100);
                    };

                    if(dataPoints[i][value] > max){
                        max = dataPoints[i][value];
                    };

                    if (dataPoints[i][value] < min) {
                        min = dataPoints[i][value];
                    };
                };

                var colorScale = d3.scale.linear()
                    .domain([min, max])
                    .range([colors[0], colors[1]]);

                max = Math.ceil(max/10) * 10;
                min = Math.floor(min/10) * 10;

                // create ticks for the scale
                var yTicks = (max - min) / 10;
                var xTicks;

                var l = dataPoints.length;

                if((l*24) > (width - dx)){
                    xTicks =   l - Math.floor( ((l*24) - (width - dx)) / 24 );
                }
                else
                    xTicks = l;

                // make axis
                var xScale = d3.scale.linear()
                    .domain([0, dataPoints.length])
                    .range([0, width - dx]);

                var yScale = d3.scale.linear()
                    .domain([max, min])
                    .range([0, height - dy]);

                var yaxis = d3.svg.axis().scale(yScale).ticks(yTicks).orient("left");
                var xaxis = d3.svg.axis().scale(xScale).ticks(xTicks).orient("bottom");

                // draw points
                graph.selectAll("circle")
                .data(dataPoints)
                .enter()
                    .append("circle")
                    .attr('class', "dataPoints")
                    .attr("stroke", "grey")
                    .attr("cx", function(d, i){
                        return xScale(i) + ((width/-2) + dx/2);
                    })
                    .attr("cy", function(d, i){
                        return yScale(d[value]) + ((height/-2) + dy/2);
                    })
                    .attr("r", 2)
                    .attr("fill", function(d, i){
                        return colorScale(d[value]);
                    });

                // add axis
                graph.append("g")
                    .call(yaxis)
                    .attr("class", "axis")
                    .attr("transform", "translate(" + ((width/-2) + dx/2) + "," + ((height/-2) + dy/2) +")")
                    .append("text")
                        .attr("transform", "rotate(-90)")
                        .attr("y", 10)
                        .attr("dy", ".71em")
                        .style("text-anchor", "end")
                        .text(labels[0]);

                graph.append("g")
                    .call(xaxis)
                    .attr("class", "axis")
                    .attr("transform", "translate(" + ((width/-2) + dx/2) +"," + (height/2 - dy/2)+ ")")
                    .append("text")
                        .attr("y", -20)
                        .attr("x", width - dx)
                        .attr("dy", ".71em")
                        .style("text-anchor", "end")
                        .text(labels[1]);

                // add title
                graph.append('text')
                .attr('font-family', 'sans-serif')
                .attr('font-size', "3vh" )
                .attr('x', 0)
                .attr('y', -(height/2) + dy/4)
                .style("text-anchor", "middle")
                .text(title); 
            });

        };

        return {
            link: link,
            restrict: 'E',
            scope: { 
                data: '=', 
                labels: '=', 
                value: '=',
                title: '=',
                colors: '=',
                percentage: '='
            }
        };
    });

})();