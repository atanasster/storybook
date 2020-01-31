import { moduleMetadata } from '@storybook/angular';

import { DummyService } from './moduleMetadata/dummy.service';
import { ServiceComponent } from './moduleMetadata/service.component';

export default {
  title: 'Custom/Providers/Controls',
  decorators: [
    moduleMetadata({
      imports: [],
      schemas: [],
      declarations: [],
      providers: [DummyService],
    }),
  ],
};

export const Simple = () => ({
  component: ServiceComponent,
  props: {
    name: 'Static name',
  },
});

Simple.story = {
  name: 'Simple',
};

export const ControlsStory = ({ name }) => ({
  component: ServiceComponent,
  props: {
    name,
  },
});

ControlsStory.story = {
  name: 'Controls',
  controls: {
    name: { type: 'text', value: 'Dynamic text' },
  },
};
