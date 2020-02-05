import React from 'react';
import { action } from '@storybook/addon-actions';
import { Button } from './Button';

export default {
  title: 'Button',
  component: Button,
};

// have props parameter to enable smart-controls
export const Text = (props: any) => (
  <Button {...props} onClick={action('clicked')}>
    Hello Button
  </Button>
);

export const Emoji = () => (
  <Button onClick={action('clicked')}>
    <span role="img" aria-label="so cool">
      😀 😎 👍 💯
    </span>
  </Button>
);
