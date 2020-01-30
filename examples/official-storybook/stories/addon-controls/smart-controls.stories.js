import React from 'react';
import Button from '../../components/BaseButton';

export default {
  title: 'Addons/Controls/smart',
  parameters: {
    component: Button,
    smartControls: true,
  },
};

export const allProps = props => <Button {...props} />;

export const onlyColors = props => <Button label="Choose colors" {...props} />;

onlyColors.story = {
  parameters: {
    smartControls: {
      include: ['color', 'backgroundColor'],
    },
  },
};

export const noColors = props => <Button label="Choose colors" {...props} />;

noColors.story = {
  parameters: {
    smartControls: {
      exclude: ['color', 'backgroundColor'],
    },
  },
};
