var svg1 = d3.select("#svg1"),
    width = +svg1.attr("width"),
    height = +svg1.attr("height"),
    innerRadius = 180,
    outerRadius = Math.min(width, height) / 2,
    g1 = svg1.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");


var xScaleOffset = 0;
var x = d3.scaleBand()
    .range([xScaleOffset, 2 * Math.PI + xScaleOffset])
    .align(0);

var y = d3.scaleLinear()
    .range([innerRadius, outerRadius]);

var z = d3.scaleOrdinal()
    .range(["#98abc5", "#8a89a6"]);

var zClasses = ['The number of starting transportation', 'The number of finishing transportation'];

d3.csv("data/time_routine1.csv", function(d, i, columns) {
  d.start = (+d.start);
  d.end =  (+d.end);
  return d;
}, function(error, data) {
  if (error) throw error;

  var keys = data.columns.slice(1);
  var meanTransports = d3.mean(data, function(d) { return d3.sum(keys, function(key) { return d[key]; }); })

  x.domain(data.map(function(d) { return d.time; }));
  y.domain([0, d3.max(data, function(d) { return (d.start + d.end); })]);
  z.domain(data.columns.slice(1));

  // transports
  g1.append('g')
      .selectAll("g")
    .data(d3.stack().keys(data.columns.slice(1))(data))
    .enter().append("g")
      .attr("fill", function(d) { return z(d.key); })
    .selectAll("path")
    .data(function(d) { return d; })
    .enter().append("path")
      .attr("d", d3.arc()
          .innerRadius(function(d) { return y(d[0]); })
          .outerRadius(function(d) { return y(d[1]); })
          .startAngle(function(d) { return x(d.data.time); })
          .endAngle(function(d) { return x(d.data.time) + x.bandwidth(); })
          .padAngle(0.005)
          .padRadius(innerRadius));

  //yAxis and Mean

  var yAxis = g1.append("g")
      .attr("text-anchor", "middle");

  var yTicksValues = d3.ticks(0, 30000, 4);

  console.log('Mean: ', meanTransports);

  // Mean value line
  var yMeanTick = yAxis
    .append("g")
    .datum([meanTransports]);



  var yTick = yAxis
    .selectAll("g")
    .data(yTicksValues)
    .enter().append("g");

  yTick.append("circle")
      .attr("fill", "none")
      .attr("stroke", "#ccdcea")
      .attr("r", y);

  yTick.append("text")
      .attr("y", function(d) { return -y(d); })
      .attr("dy", "0.35em")
      .attr("fill", "none")
      .attr("stroke", "#fff")
      .attr("stroke-width", 5)
      .text(y.tickFormat(5, "s"));

  yTick.append("text")
      .attr("y", function(d) { return -y(d); })
      .attr("dy", "0.35em")
      .text(y.tickFormat(5, "s"));

  yAxis.append("text")
      .attr("y", function(d) { return -y(yTicksValues.pop()); })
      .attr("dy", "-2em");
  // Labels for xAxis

  var label = g1.append("g")
    .selectAll("g")
    .data(data)
    .enter().append("g")
      .attr("text-anchor", "middle")
      .attr("transform", function(d) { return "rotate(" + ((x(d.time) + x.bandwidth() / 2) * 180 / Math.PI - 90) + ")translate(" + innerRadius + ",0)"; });

  label.append("line")
      .attr("x2", function(d) { return (((d.time % 1) == 0) | (d.time == '1')) ? -7 : -4 })
      .attr("stroke", "#000");

  label.append("text")
      .attr("transform", function(d) { return (x(d.time) + x.bandwidth() / 2 + Math.PI / 2) % (2 * Math.PI) < Math.PI ? "rotate(90)translate(0,16)" : "rotate(-90)translate(0,-9)"; })
      .text(function(d) {
        var xlabel = (((d.time % 1) == 0) | (d.time == '1')) ? parseInt(d.time) : '';
        return xlabel; });

// Legend
  var legend = g1.append("g")
    .selectAll("g")
    .data(zClasses)
    .enter().append("g")
      .attr("transform", function(d, i) { return "translate(-50," + (i - (zClasses.length - 1) / 2) * 25+ ")"; });

  legend.append("circle")
      .attr("r", 8)
      .attr("fill", z);

  legend.append("text")
      .attr("x", 15)
      .attr("y", 0)
      .attr("dy", "0.35em")
      .text(function(d) { return d; });

});
