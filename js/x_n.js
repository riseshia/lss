window.render_x_n = function() {
  d3.select('#graph-x_n svg').remove();
  $("#graph-x_n").html("<svg></svg>");

  nv.addGraph(function() {
      data = populateSS(x_t,1.5);
      amp = x_t.amp;
      dc = x_t.dc;

      interval = cut(1000/(200*x_t.fre));

      var chart = nv.models.linePlusBarChart()
        .margin({top: 30, right: 60, bottom: 50, left: 70})
        .x(function(d,i) {
          return i*interval;
        })
        .y(function(d) { return d[1] })
        .tooltips(false)
        .color(d3.scale.category10().range());

      chart.xAxis    //Chart x-axis settings
        .axisLabel('Time(ms)')
        .tickFormat(d3.format(',r'));

      chart.y1Axis
        .tickFormat(d3.format('.02f'));

      chart.bars.forceY([dc-amp,amp+dc]);
      low = 0;
      if (dc-amp < 0)
        low = dc-amp;
      chart.lines.forceY([low,amp+dc]);

      chart.y2Axis
        .tickFormat(d3.format('.02f'));

      d3.select('#graph-x_n svg')
        .datum(data)
        .transition().duration(500)
        .call(chart)
        ;

      nv.utils.windowResize(chart.update);

      return chart;
  });
}

window.render_x_n_s = function() {
  nv.addGraph(function() {
    var chart = nv.models.discreteBarChart()
      .x(function(d) { return d.label })
      .y(function(d) { return d.value })
      .staggerLabels(false)
      .tooltips(false)
      .showValues(false)
      .showXAxis(false)
      .showYAxis(false);

    d3.select('#graph-x_n_s svg')
      .datum(populateSpec(x_n))
      .transition().duration(500)
      .call(chart);

    nv.utils.windowResize(chart.update);

    return chart;
  });
}

window.render_x_n2 = function() {
  /* Default Graph */
  nv.addGraph(function() {
    var chart = nv.models.lineChart()
                  .margin({left: 100})  //Adjust chart margins to give the x-axis some breathing room.
                  .useInteractiveGuideline(true)  //We want nice looking tooltips and a guideline!
                  .transitionDuration(350)  //how fast do you want the lines to transition?
                  .showLegend(false)       //Show the legend, allowing users to turn on/off line series.
                  .showYAxis(true)        //Show the y-axis
                  .showXAxis(true)        //Show the x-axis
    ;

    chart.xAxis     //Chart x-axis settings
        .axisLabel('n (th-Sampled)')
        .tickFormat(d3.format(',r'));

    chart.yAxis     //Chart y-axis settings
        .tickFormat(d3.format(',r'));

    d3.select('#graph-x_n2 svg')    //Select the <svg> element you want to render the chart in.
        .datum(populateDiscrete(x_n,2.5))         //Populate the <svg> element with chart data...
        .call(chart);          //Finally, render the chart!

    //Update the chart when window resizes.
    nv.utils.windowResize(function() { chart.update() });

    return chart;
  });
};