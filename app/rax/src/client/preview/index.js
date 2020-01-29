import { start } from '@storybook/core/client';

import './globals';
import render from './render';

const { configure: coreConfigure, clientApi, forceReRender } = start(render);

export const {
  setAddon,
  addDecorator,
  addParameters,
  addProperties,
  clearDecorators,
  getStorybook,
  raw,
} = clientApi;

const framework = 'rax';
export const storiesOf = (...args) => clientApi.storiesOf(...args).addParameters({ framework });
export const configure = (...args) => coreConfigure(...args, framework);

export { forceReRender };
