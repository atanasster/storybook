import { addParameters } from '@storybook/client-api';
import { extractSmartProperties } from './smartControls';
import { createControlsPanel } from './preview/PreviewPanel';
import { createPropsTableControls } from './preview/PropsTable';

addParameters({
  options: {
    propExtractor: extractSmartProperties,
  },
  docs: {
    addons: {
      preview: {
        controls: createControlsPanel,
      },
      propsTable: {
        controls: createPropsTableControls,
      },
    },
  },
  controls: {
    smart: true,
  },
});
