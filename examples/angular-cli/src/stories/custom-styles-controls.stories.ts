import { moduleMetadata } from '@storybook/angular';
import { action } from '@storybook/addon-actions';
import { Button } from '@storybook/angular/demo';

export default {
  title: 'Custom/Style/Controls',
  decorators: [
    moduleMetadata({
      declarations: [Button],
    }),
  ],
};

export const DefaultStory = () => ({
  template: `<storybook-button-component [text]="text" (onClick)="onClick($event)"></storybook-button-component>`,
  props: {
    text: 'Button with custom styles',
    onClick: action('log'),
  },
  styles: [
    `
      storybook-button-component {
        background-color: yellow;
        padding: 25px;
      }
    `,
  ],
});

DefaultStory.story = {
  name: 'Default',
};

export const ControlsStory = ({ name, onClick }) => ({
  template: `<storybook-button-component [text]="name" (onClick)="onClick($event)"></storybook-button-component>`,
  props: {
    name,
    onClick,
  },
  styles: [
    `
  storybook-button-component {
    background-color: red;
    padding: 25px;
  }
`,
  ],
});

ControlsStory.story = {
  name: 'Controls',
  controls: {
    name: { type: 'text', value: 'Button with custom styles' },
    onClick: { type: 'button', value: action('log') },
  },
};
