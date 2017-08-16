import AggResponseTabifyTabifyProvider from 'ui/agg_response/tabify/tabify';
import uiModules from 'ui/modules';
import { assign } from 'lodash';

// get the kibana/kbn_dotplot module, and make sure that it requires the "kibana" module if it
// didn't already
const module = uiModules.get('kibana/kbn_dotplot', ['kibana']);

// add a controller to tha module, which will transform the esResponse into a
// tabular format that we can pass to the table directive
module.controller('KbnDotplotVisController', function ($scope, $element, Private) {
  const tabifyAggResponse = Private(AggResponseTabifyTabifyProvider);

  const uiStateSort = ($scope.uiState) ? $scope.uiState.get('vis.params.sort') : {};
  assign($scope.vis.params.sort, uiStateSort);

  var Plotly = require('plotly.js/lib/core');

  $scope.$watchMulti(['esResponse', 'vis.params'], function ([resp]) {

    if(resp){
      var firstFieldAggId = $scope.vis.aggs.bySchemaName['term'][0].id;
      var POP_TO_PX_SIZE = 2e5;
      var data = resp.aggregations[firstFieldAggId].buckets.map(function(bucket) {
        return {
          mode: 'markers',
          name: bucket.key,
          x: [bucket.doc_count],
          y: [bucket.doc_count],
          text: bucket.key,
          marker: {
              sizemode: 'diameter',
              size: 10,
              sizeref: POP_TO_PX_SIZE
          }
        }
      });
      var layout = {
        xaxis: {title: 'Count'},
        yaxis: {title: 'Count', type: 'log'},
        margin: {t: 20},
        hovermode: 'closest',
        showlegend: false,
      };
      Plotly.newPlot('my-graph', data, layout, {showLink: false})
    }

    /*Plotly.d3.csv('https://raw.githubusercontent.com/plotly/datasets/master/gapminderDataFiveYear.csv', function(err, rows){
    var YEAR = 2007;
    var continents = ['Asia', 'Europe', 'Africa', 'Oceania', 'Americas'];
    var POP_TO_PX_SIZE = 2e5;
    function unpack(rows, key) {
    return rows.map(function(row) { return row[key]; });
    }

    var data = continents.map(function(continent) {
    var rowsFiltered = rows.filter(function(row) {
        return (row.continent === continent) && (+row.year === YEAR);
    });
    return {
        mode: 'markers',
        name: continent,
        x: unpack(rowsFiltered, 'lifeExp'),
        y: unpack(rowsFiltered, 'gdpPercap'),
        text: unpack(rowsFiltered, 'country'),
        marker: {
            sizemode: 'area',
            size: unpack(rowsFiltered, 'pop'),
            sizeref: POP_TO_PX_SIZE
        }
    };
  });*/
    ;

  });
});
