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

  $scope.$watchMulti(['esResponse', 'vis.params.perPage'], function ([resp]) {

    if(resp){
      var id_firstfield = '0'
      var id_secondfield;
      var id_x = '1'
      var id_y = '2'
      var id_size = '3'
      var dicColor = {}
      //Names of the field that have been selected
      var firstFieldAggId = $scope.vis.aggs.bySchemaName['field'][0].id;
      var fieldAggName = $scope.vis.aggs.bySchemaName['field'][0].params.field.displayName;
      if($scope.vis.aggs.bySchemaName['field'][1]){
        id_secondfield = '1'
        id_x = '2'
        id_y = '3'
        id_size = '4'
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

      //Size
      if($scope.vis.aggs.bySchemaName['dotsize']){
        var radius_label = ""
        var metricsAgg_radius = $scope.vis.aggs.bySchemaName['dotsize'][0]

        var radius_ratio = +metricsAgg_radius.vis.params.radiusRatio

        if(metricsAgg_radius.params.customLabel) {
          radius_label = metricsAgg_radius.params.customLabel
        } else {

          var metricsAgg_radius_title = metricsAgg_radius.type.title

          if(metricsAgg_radius.type.name != "count"){
            var metricsAgg_radius_name = metricsAgg_radius.params.field.displayName
            radius_label = metricsAgg_radius_title + " " + metricsAgg_radius_name
          }else{
            radius_label = metricsAgg_radius_title
          }
        }
      }


      var defaultDotSize = 10
      // compite size for single bucket
      if(metricsAgg_radius) {
        var firstBuketSized = resp.tables[0].rows.map(function (b) { return b[id_size] })
        var max = Math.max(...firstBuketSized)
        var min = Math.min(...firstBuketSized)
        var chartMin = 10
        var chartMax = 100
        var step = max - min
        var chartDiff = chartMax - chartMin
      }
      console.log(resp)
      var dataParsed = resp.tables[0].rows.map(function(bucket) {

        //If two buckets selected
        if(secondFieldAggId){
          if (dicColor[bucket[id_firstfield]]){
            var colorOrg = dicColor[bucket[id_firstfield]];
          }else{
            var colorOrg = randomColor();
            dicColor[bucket[id_firstfield]] = colorOrg;
          }


          //Size
          var size = defaultDotSize
          if(metricsAgg_radius) {
            size = ((bucket[id_size] - min) / step) * chartDiff + chartMin
          }
          return {
            mode: 'markers',
            name: bucket[id_secondfield],
            x: [bucket[id_x]],
            y: [bucket[id_y]],
            text: bucket[id_secondfield],
            marker: {
                color: colorOrg,
                sizemode: 'diameter',
                size: size
            }
          }
        }
        //If only one bucket selected
        var size = defaultDotSize
        if(metricsAgg_radius) {
          size = ((bucket[id_size] - min) / step) * chartDiff + chartMin
        }
        return {
          mode: 'markers',
          name: bucket[id_firstfield],
          x: [bucket[id_x]],
          y: [bucket[id_y]],
          text: bucket[id_firstfield],
          marker: {
              sizemode: 'diameter',
              size: size,
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

      Plotly.newPlot('dotplot-graph', data, layout, {showLink: false})
    }

  });
});
