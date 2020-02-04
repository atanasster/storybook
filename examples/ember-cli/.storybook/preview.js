import { addParameters, addDecorator } from '@storybook/ember';
import { setJSONDoc } from '@storybook/addon-docs/ember';
import docJson from '../ember-output/storybook-docgen/index.json';

setJSONDoc(docJson);
addParameters({
  options: {
    showRoots: true,
  },
});
