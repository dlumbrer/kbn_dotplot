import 'plugins/kbn_dotplot/kbn_dotplot.less';
import 'plugins/kbn_dotplot/kbn_dotplot_params';

import { KbnDotplotVisController } from './kbn_dotplot_controller';
import { VisFactoryProvider } from 'ui/vis/vis_factory';
import { Schemas } from 'ui/vis/editors/default/schemas';
import DotplotVisTemplate from 'plugins/kbn_dotplot/kbn_dotplot.html';
import DotplotVisParamsTemplate from 'plugins/kbn_dotplot/kbn_dotplot_params.html';
import { VisTypesRegistryProvider } from 'ui/registry/vis_types';
import image from './images/dots.svg';
// we need to load the css ourselves

// we also need to load the controller and used by the template

// our params are a bit complex so we will manage them with a directive

// require the directives that we use as well

// register the provider with the visTypes registry
VisTypesRegistryProvider.register(DotplotVisTypeProvider);

// define the DotplotVisType
function DotplotVisTypeProvider(Private) {
  const VisFactory = Private(VisFactoryProvider);

  // define the DotplotVisController which is used in the template
  // by angular's ng-controller directive

  // return the visType object, which kibana will use to display and configure new
  // Vis object of this type.
  return VisFactory.createAngularVisualization({
    name: 'dotplot',
    title: 'Dot plot',
    image,
    description: 'Display values in a dot plot',
    visConfig: {
      defaults: {
        perPage: 10,
        showPartialRows: false,
        showMeticsAtAllLevels: false,
        sort: {
          columnIndex: null,
          direction: null
        },
        showTotal: false,
        totalFunc: 'sum',
        caseSensitive: true
      },
      template: DotplotVisTemplate
    },
    editorConfig: {
      optionsTemplate: DotplotVisParamsTemplate,
      schemas: new Schemas([
        {
          group: 'metrics',
          name: 'x-axis',
          title: 'X-Axis',
          aggFilter: '!geo_centroid',
          max: 1,
          defaults: [
            { type: 'count', schema: 'x-axis' }
          ]
        },
        {
          group: 'metrics',
          name: 'y-axis',
          title: 'Y-Axis',
          aggFilter: '!geo_centroid',
          max: 1,
          defaults: [
            { type: 'count', schema: 'y-axis' }
          ]
        },
        {
          group: 'metrics',
          name: 'dotsize',
          title: 'Dot Size',
          aggFilter: '!geo_centroid',
          max: 1
        },
        {
          group: 'buckets',
          name: 'field',
          title: 'Field',
          max: 2,
          min: 1,
          aggFilter: ['terms', 'filters']
        }
      ])
    },
    implementsRenderComplete: true,
    hierarchicalData: function (vis) {
      return Boolean(vis.params.showPartialRows || vis.params.showMeticsAtAllLevels);
    }

  });
}

export default DotplotVisTypeProvider;
