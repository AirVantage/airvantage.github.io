'use strict';

/* Directives */

appmodule.directive('graph', function(){
	
	// constants
	var margin = 40,
	width = 940,
	height = 400,
	pointRadius = 3

	return {
		restrict: 'EA',
		scope: true,
		replace: true,
		link: function (scope, element, attrs){

			var vis = d3.select(element[0])
			.append("svg")
			.attr("width", width)
			.attr("height", height);

			var grid = vis.append("g")
			.attr("transform", "translate("+margin+" "+margin+")")

			var graph = vis.append("g")
			.attr("transform", "translate("+margin+" "+margin+")")

			var p = graph.append('path')


			scope.$watch(attrs.value, function(newValue, oldValue){

				var time_extent = d3.extent(newValue, function(d){return d.timestamp});

				var time_scale = d3.time.scale().domain(time_extent).range([0, width-2*margin]);

				var value_scale = d3.scale.linear()
				.domain([d3.min(newValue, value) * .8, d3.max(newValue, value) * 1.2])
				.range([height-2*margin, margin])

				function value (i) {
					return i.value
				}

				function timeFormat(formats) {
				  return function(date) {
				    var i = formats.length - 1, f = formats[i];
				    while (!f[1](date)) f = formats[--i];
				    return f[0](date);
				  };
				}

				var customTimeFormat = timeFormat([
				  [d3.time.format("%Y"), function() { return true; }],
				  [d3.time.format("%B"), function(d) { return d.getMonth(); }],
				  [d3.time.format("%b %d"), function(d) { return d.getDate() != 1; }],
				  [d3.time.format("%a %d"), function(d) { return d.getDay() && d.getDate() != 1; }],
				  [d3.time.format("%I %p"), function(d) { return d.getHours(); }],
				  [d3.time.format("%I:%M"), function(d) { return d.getMinutes(); }],
				  [d3.time.format(":%S"), function(d) { return d.getSeconds(); }],
				  [d3.time.format(".%L"), function(d) { return d.getMilliseconds(); }]
				]);

				var time_axis = d3.svg.axis().scale(time_scale).tickFormat(customTimeFormat);

				var value_axis = d3.svg.axis().scale(value_scale).orient("left");

				var line = d3.svg.line().x(function(d){return time_scale(d.timestamp)}).y(function(d){return value_scale(d.value)});

				grid.selectAll(".axis")
				.remove()

				grid.append("g")
				.attr("transform", "translate(0," + (height-2*margin) + ")")
				.attr("class", "x axis")
				.call(time_axis);

				grid.append("g")
				.attr("class", "y axis")
				.call(value_axis);

				p.transition()
				.duration(500)
				.attr('d', line(newValue))
				.style("stroke", "#333333")

				var g = graph.selectAll('.'+attrs.value).data(newValue, function(t){return t.timestamp})

				g.enter()
				.append('circle')
				.attr('class', attrs.value)
				.attr("cx", function(d){return time_scale(d.timestamp)})
				.attr("cy", function(d){return value_scale(d.value)})
				.attr("r", pointRadius+margin)
				.style("fill", "#333333")
				.style("opacity", "0")

				g.transition()
				.duration(500)
				.attr("cx", function(d){return time_scale(d.timestamp)})
				.attr("cy", function(d){return value_scale(d.value)})
				.attr("r", pointRadius)
				.style("fill", "#333333")
				.style("opacity", "1")

				g.exit()
				.remove()


			}, true)
		}
	}
});