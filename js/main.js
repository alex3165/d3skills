requirejs.config({
    paths: {
          'jquery': 'jquery',
          'd3': '../bower_components/d3/d3',
          'sankey': 'sankey'
    }
});

requirejs(['jquery', 'd3', 'sankey'], function ($, d3) {

});