import { addParameters } from '@storybook/client-api';
import { extractSmartControls } from './smartControls';
import { createControlsPanel } from './preview/PreviewPanel';
import { createPropsTableControls } from './preview/PropsTable';

addParameters({
  options: {
    enhanceControls: extractSmartControls,
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
