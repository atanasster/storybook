import { hbs } from 'ember-cli-htmlbars';
import { action } from '@storybook/addon-actions';

export default {
  title: 'Addon/Controls',

  parameters: {
    options: { selectedPanel: 'storybookjs/controls/panel' },
  },
};

export const WithText = props => ({
  template: hbs`
      {{welcome-banner
        style=(if hidden "display: none")
        backgroundColor=backgroundColor
        titleColor=titleColor
        subTitleColor=subTitleColor
        title=title
        subtitle=subtitle
        click=(action onClick)
      }}
    `,
  context: props,
});

WithText.story = {
  name: 'with text',
  controls: {
    hidden: { type: 'boolean', value: false },
    backgroundColor: { type: 'color', value: '#FDF4E7' },
    titleColor: { type: 'color', value: '#DF4D37' },
    subTitleColor: { type: 'color', value: '#B8854F' },
    title: { type: 'text', value: 'Welcome to storybook' },
    subtitle: { type: 'text', value: 'This environment is completely editable' },
    onClick: { type: 'button', value: action('clicked') },
  },
};
