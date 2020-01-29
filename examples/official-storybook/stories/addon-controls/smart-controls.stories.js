import React from 'react';
import Button from '../../components/BaseButton';

export default {
  title: 'Addons/Controls/smart',
  parameters: {
    component: Button,
    smartControls: true,
  },
};

export const basic = props => <Button label="Basic" {...props} />;
