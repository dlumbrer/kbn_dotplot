import { AggResponseTabifyProvider } from 'ui/agg_response/tabify/tabify';
import { uiModules } from 'ui/modules';
import { assign } from 'lodash';

// get the kibana/kbn_dotplot module, and make sure that it requires the "kibana" module if it
// didn't already
const module = uiModules.get('kibana/kbn_dotplot', ['kibana']);

// add a controller to tha module, which will transform the esResponse into a
// tabular format that we can pass to the table directive
module.controller('KbnDotplotVisController', function ($scope, $element, Private) {
  const tabifyAggResponse = Private(AggResponseTabifyProvider);

  const uiStateSort = ($scope.uiState) ? $scope.uiState.get('vis.params.sort') : {};
  assign($scope.vis.params.sort, uiStateSort);

  var Plotly = require('plotly.js/lib/core');

  const randomColor = require('randomcolor');

  $scope.$watchMulti(['esResponse', 'vis.params'], function ([resp]) {

    if(resp){

      //Names of the field that have been selected
      var firstFieldAggId = $scope.vis.aggs.bySchemaName['field'][0].id;
      var fieldAggName = $scope.vis.aggs.bySchemaName['field'][0].params.field.displayName;
      if($scope.vis.aggs.bySchemaName['field'][1]){
        var secondFieldAggId = $scope.vis.aggs.bySchemaName['field'][1].id;
        var secondfieldAggName = $scope.vis.aggs.bySchemaName['field'][1].params.field.displayName;
      }


      // Retrieve the metrics aggregation configured
      if($scope.vis.aggs.bySchemaName['x-axis']){
          var metricsAgg_xAxis = $scope.vis.aggs.bySchemaName['x-axis'][0];
          if($scope.vis.aggs.bySchemaName['x-axis'][0].type.name != "count"){
            var metricsAgg_xAxis_name = $scope.vis.aggs.bySchemaName['x-axis'][0].params.field.displayName;
          }else{
            var metricsAgg_xAxis_name = ""
          }
          var metricsAgg_xAxis_title = $scope.vis.aggs.bySchemaName['x-axis'][0].type.title
      }
      if($scope.vis.aggs.bySchemaName['y-axis']){
          var metricsAgg_yAxis = $scope.vis.aggs.bySchemaName['y-axis'][0];
          if($scope.vis.aggs.bySchemaName['y-axis'][0].type.name != "count"){
            var metricsAgg_yAxis_name = $scope.vis.aggs.bySchemaName['y-axis'][0].params.field.displayName;
          }else{
            var metricsAgg_yAxis_name = "";
          }
          var metricsAgg_yAxis_title = $scope.vis.aggs.bySchemaName['y-axis'][0].type.title
      }


      var POP_TO_PX_SIZE = 2e5;
      var dataParsed = resp.aggregations[firstFieldAggId].buckets.map(function(bucket) {

        //If two buckets selected
        if(bucket[secondFieldAggId]){
          var colorOrg = randomColor();
          var aux = bucket[secondFieldAggId].buckets.map(function(buck) {
            return {
              mode: 'markers',
              name: buck.key,
              x: [metricsAgg_xAxis.getValue(buck)],
              y: [metricsAgg_yAxis.getValue(buck)],
              text: buck.key,
              marker: {
                  color: colorOrg,
                  sizemode: 'diameter',
                  size: 10,
                  sizeref: POP_TO_PX_SIZE
              }
            }
          })

          return aux;
        }
        //If only one bucket selected
        return {
          mode: 'markers',
          name: bucket.key,
          x: [metricsAgg_xAxis.getValue(bucket)],
          y: [metricsAgg_yAxis.getValue(bucket)],
          text: bucket.key,
          marker: {
              sizemode: 'diameter',
              size: 10,
              sizeref: POP_TO_PX_SIZE
          }
        }
      });
      var layout = {
        xaxis: {title: metricsAgg_xAxis_title + " " + metricsAgg_xAxis_name},
        yaxis: {title: metricsAgg_yAxis_title + " " + metricsAgg_yAxis_name},//, type: 'log'},
        margin: {t: 20},
        hovermode: 'closest',
        showlegend: false,
      };

      var data = [];
      for (var i = 0; i < dataParsed.length; i++) {
        data = data.concat(dataParsed[i])
      }
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
