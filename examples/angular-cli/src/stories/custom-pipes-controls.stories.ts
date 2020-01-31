import { moduleMetadata } from '@storybook/angular';

import { NameComponent } from './moduleMetadata/name.component';
import { CustomPipePipe } from './moduleMetadata/custom.pipe';

export default {
  title: 'Custom/Pipes/Controls',
  decorators: [
    moduleMetadata({
      imports: [],
      schemas: [],
      declarations: [CustomPipePipe],
      providers: [],
    }),
  ],
};

export const Simple = () => ({
  component: NameComponent,
  props: {
    field: 'foobar',
  },
});

Simple.story = {
  name: 'Simple',
};

export const ControlsStory = ({ field }) => ({
  component: NameComponent,
  props: {
    field,
  },
});

ControlsStory.story = {
  name: 'Controls',
  controls: {
    field: { type: 'text', value: 'foobar' },
  },
};
