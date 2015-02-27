requirejs.config({
    paths: {
          'jquery': 'jquery',
          'd3': '../bower_components/d3/d3',
          'sankey': 'sankey'
    },
    shim: {
        'sankey': ['d3']
    }
});

requirejs(['jquery', 'd3', 'sankey'], function ($, d3) {
    var units = "widgets";

    var margin = {
        top: 10,
        right: 10,
        bottom: 10,
        left: 10
    };

    var width = 700 - margin.left - margin.right;
    var height = 300 - margin.top - margin.bottom;

    var sankey = d3.sankey()
       .nodeWidth(10)
       .nodePadding(40)
       .size([width, height]);

    var formatNumber = d3.format(",.0f");
    var format = function(d) {
            return formatNumber(d) + " " + units;
    };
    var color = d3.scale.category20();

    var svg = d3.select('#chart').append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var path = sankey.link();

    d3.json("js/data/skills.json", function(error, graph){
        // debugger;
        sankey.nodes(graph.nodes)
              .links(graph.links)
              .layout(32);

        var link = svg.append("g").selectAll(".link")
              .data(graph.links)
              .enter().append("path")
              .attr("class", "link")
              .attr("d", path)
              .style("stroke-width", function(d) { // skills strongs here
                // debugger;
                return Math.max(1, d.value);
              })
              .sort(function(a, b) {
                return b.dy - a.dy;
              });

        link.append("title")
            .text(function(d) {
                // debugger;
                return d.source.name + " → " + d.target.name + "\n" + format(d.value);
            });
    });
});