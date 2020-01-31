import { OnPushBoxComponent } from './on-push-box.component';

export default {
  title: 'Core/OnPush/Controls',
};

export const ClassSpecifiedComponentWithOnPush = props => ({
  component: OnPushBoxComponent,
  props,
});

ClassSpecifiedComponentWithOnPush.story = {
  name: 'Class-specified component with OnPush and Controls',
  parameters: {
    notes: `
      This component is specified by class and uses OnPush change detection. It has two properties, one being a HostBinding. Both should be updatable using knobs.
    `.trim(),
  },
  controls: {
    word: { type: 'text', label: 'Word', value: 'OnPush' },
    bgColor: { type: 'color', label: 'Box color', value: '#FFF000' },
  },
};
