import { addParameters, addDecorator } from '@storybook/angular';
import { setCompodocJson } from '@storybook/addon-docs/angular';
import addCssWarning from '../src/cssWarning';

import docJson from '../documentation.json';

setCompodocJson(docJson);

addCssWarning();

addParameters({
  docs: {
    // inlineStories: true,
    iframeHeight: '60px',
  },
});
