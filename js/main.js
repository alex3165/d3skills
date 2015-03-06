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
        top: 20,
        right: 20,
        bottom: 20,
        left: 20
    };

    var width = 800 - margin.left - margin.right;
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

    /**
    *
    * Create the drop shadow effect
    *
    **/
    var defs = svg.append("defs");

    var filter = defs.append("filter")
        .attr("id", "drop-shadow")
        .attr("height", "600%");

    filter.append("feGaussianBlur")
        .attr("in", "SourceAlpha")
        .attr("stdDeviation", 3)
        .attr("result", "blur");

    filter.append("feOffset")
        .attr("in", "blur")
        .attr("dx", 3)
        .attr("dy", 3)
        .attr("result", "offsetBlur");

    var feMerge = filter.append("feMerge");
    feMerge.append("feMergeNode").attr("in", "offsetBlur");
    feMerge.append("feMergeNode").attr("in", "SourceGraphic");

    /*******************************/

    var path = sankey.link();

    d3.json("js/data/skills.json", function(error, graph){

        sankey.nodes(graph.nodes)
              .links(graph.links)
              .layout(32);

        var link = svg.append("g").selectAll(".link")
              .data(graph.links)
              .enter().append("path")
              .attr("class", "link")
              .attr("d", path)
              .style("stroke-width", function(d) {
                return Math.max(1, d.value);
              })
              .style("filter", "url(#drop-shadow)")
              .sort(function(a, b) {
                return b.dy - a.dy;
              });

        link.append("title")
            .text(function(d) {
                return d.source.name + " → " + d.target.name + "\n" + format(d.value);
            });
    });
});