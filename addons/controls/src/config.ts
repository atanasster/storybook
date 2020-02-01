import { addParameters } from '@storybook/client-api';
import { extractSmartProperties } from './smartControls';
import { createControlsPanel } from './preview/PreviewPanel';

addParameters({
  options: {
    propExtractor: extractSmartProperties,
  },
  docs: {
    addons: {
      preview: {
        controls: createControlsPanel,
      },
    },
  },
});
