window.render_y_n = function() {
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

    d3.select('#graph-y_n svg')    //Select the <svg> element you want to render the chart in.
        .datum(populateDiscrete(y_n,2.5))         //Populate the <svg> element with chart data...
        .call(chart);          //Finally, render the chart!

    //Update the chart when window resizes.
    nv.utils.windowResize(function() { chart.update() });

    return chart;
  });
};
