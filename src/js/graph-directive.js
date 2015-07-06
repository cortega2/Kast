// based on the donut directive above and some of my old code from a prev project
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
        var locationTab = scope.locationTab;

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

            dataObject = dataPoints;

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
                .domain([0, dataPoints.length - 1])
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
                    if(isNaN(d[value])){
                        return  0;
                    }
                    else{
                        return yScale(d[value]) + ((height/-2) + dy/2);
                    }
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
            percentage: '=',
            locationTab: '='
        }
    };
}); 