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