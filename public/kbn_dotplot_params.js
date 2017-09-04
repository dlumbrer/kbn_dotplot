import { uiModules } from 'ui/modules';
import DotplotVisParamsTemplate from 'plugins/kbn_dotplot/kbn_dotplot_params.html';

uiModules.get('kibana/kbn_dotplot')
.directive('dotplotVisParams', function () {
  return {
    restrict: 'E',
    template: DotplotVisParamsTemplate,
    link: function ($scope) {
      $scope.totalAggregations = ['sum', 'avg', 'min', 'max', 'count'];

      $scope.$watchMulti([
        'vis.params.showPartialRows',
        'vis.params.showMeticsAtAllLevels'
      ], function () {
        if (!$scope.vis) return;

        const params = $scope.vis.params;
        if (params.showPartialRows || params.showMeticsAtAllLevels) {
          $scope.metricsAtAllLevels = true;
        } else {
          $scope.metricsAtAllLevels = false;
        }
      });
    }
  };
});
