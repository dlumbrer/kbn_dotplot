/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import _ from 'lodash';

import randomColor from 'randomcolor';
import Plotly from 'plotly.js/lib/core'

import AggConfigResult from './data_load/agg_config_result';
import { getNotifications, getFormatService } from './services';

// KbnDotplotVis AngularJS controller
function KbnDotplotVisController($scope, config, $timeout) {

  $scope.$watchMulti(['esResponse', 'vis.params'], function ([resp]) {

    if (resp) {
      var id_firstfield = '0'
      var id_secondfield;
      var id_x = '1'
      var id_y = '2'
      var id_size = '3'
      var dicColor = {}
      //Names of the field that have been selected
      var firstFieldAggId = resp.aggs.bySchemaName('field')[0].id;
      if (resp.aggs.bySchemaName('field')[0].params.field) {
        var fieldAggName = resp.aggs.bySchemaName('field')[0].params.field.displayName;
      }
      if (resp.aggs.bySchemaName('field')[1] && resp.aggs.bySchemaName('field')[1].enabled) {
        if (resp.aggs.bySchemaName('dotsize')[0] && resp.aggs.bySchemaName('dotsize')[0].enabled) {
          var id_secondfield = '4'
          var id_x = '5'
          var id_y = '6'
          var id_size = '7'
        } else {
          var id_secondfield = '3'
          var id_x = '4'
          var id_y = '5'
        }


        var secondFieldAggId = resp.aggs.bySchemaName('field')[1].id;
        var secondFieldAggEnabled = resp.aggs.bySchemaName('field')[1].enabled
        if (resp.aggs.bySchemaName('field')[1].params.field) {
          var secondfieldAggName = resp.aggs.bySchemaName('field')[1].params.field.displayName;
        }
      }


      // Retrieve the metrics aggregation configured
      if (resp.aggs.bySchemaName('x-axis')) {
        var metricsAgg_xAxis = resp.aggs.bySchemaName('x-axis')[0];
        if (resp.aggs.bySchemaName('x-axis')[0].type.name != "count") {
          var metricsAgg_xAxis_name = resp.aggs.bySchemaName('x-axis')[0].params.field.displayName;
        } else {
          var metricsAgg_xAxis_name = ""
        }
        var metricsAgg_xAxis_title = resp.aggs.bySchemaName('x-axis')[0].type.title
      }
      if (resp.aggs.bySchemaName('y-axis')) {
        var metricsAgg_yAxis = resp.aggs.bySchemaName('y-axis')[0];
        if (resp.aggs.bySchemaName('y-axis')[0].type.name != "count") {
          var metricsAgg_yAxis_name = resp.aggs.bySchemaName('y-axis')[0].params.field.displayName;
        } else {
          var metricsAgg_yAxis_name = "";
        }
        var metricsAgg_yAxis_title = resp.aggs.bySchemaName('y-axis')[0].type.title
      }

      //Size
      if (resp.aggs.bySchemaName('dotsize').length) {
        var radius_label = ""
        var metricsAgg_radius = resp.aggs.bySchemaName('dotsize')[0]

        if (metricsAgg_radius.params.customLabel) {
          radius_label = metricsAgg_radius.params.customLabel
        } else {

          var metricsAgg_radius_title = metricsAgg_radius.type.title

          if (metricsAgg_radius.type.name != "count") {
            var metricsAgg_radius_name = metricsAgg_radius.params.field.displayName
            radius_label = metricsAgg_radius_title + " " + metricsAgg_radius_name
          } else {
            radius_label = metricsAgg_radius_title
          }
        }
      }


      var defaultDotSize = 10
      // compite size for single bucket
      if (metricsAgg_radius && metricsAgg_radius.enabled) {
        var firstBuketSized = resp.tables[0].rows.map(function (b) { return b[id_size] })
        var max = Math.max(...firstBuketSized)
        var min = Math.min(...firstBuketSized)
        var chartMin = 10
        var chartMax = 100
        var step = max - min
        var chartDiff = chartMax - chartMin
      }
      console.log(resp)
      var dataParsed = resp.tables[0].rows.map(function (bucket) {

        //If two buckets selected
        if (secondFieldAggId && secondFieldAggEnabled) {
          if (dicColor[bucket[id_firstfield].value]) {
            var colorOrg = dicColor[bucket[id_firstfield].value];
          } else {
            var colorOrg = randomColor();
            dicColor[bucket[id_firstfield].value] = colorOrg;
          }


          //Size
          var size = defaultDotSize
          if (metricsAgg_radius && metricsAgg_radius.enabled) {
            size = ((bucket[id_size].value - min) / step) * chartDiff + chartMin
          }
          return {
            mode: 'markers',
            name: bucket[id_secondfield].value,
            x: [bucket[id_x].value],
            y: [bucket[id_y].value],
            text: bucket[id_secondfield].value,
            marker: {
              color: colorOrg,
              sizemode: 'diameter',
              size: size
            }
          }
        }
        //If only one bucket selected
        var size = defaultDotSize
        if (metricsAgg_radius && metricsAgg_radius.enabled) {
          size = ((bucket[id_size].value - min) / step) * chartDiff + chartMin
        }
        return {
          mode: 'markers',
          name: bucket[id_firstfield].value,
          x: [bucket[id_x].value],
          y: [bucket[id_y].value],
          text: bucket[id_firstfield].value,
          marker: {
            sizemode: 'diameter',
            size: size,
          }
        }
      });
      var layout = {
        xaxis: { title: metricsAgg_xAxis_title + " " + metricsAgg_xAxis_name },
        yaxis: { title: metricsAgg_yAxis_title + " " + metricsAgg_yAxis_name },//, type: 'log'},
        margin: { t: 20 },
        hovermode: 'closest',
        showlegend: false,
      };

      var data = [];
      for (var i = 0; i < dataParsed.length; i++) {
        data = data.concat(dataParsed[i])
      }
      $timeout(function () {
        Plotly.newPlot('dotplot-graph_' + $scope.$id, data, layout, { showLink: false })
      })
    }

  });
}

export { KbnDotplotVisController };