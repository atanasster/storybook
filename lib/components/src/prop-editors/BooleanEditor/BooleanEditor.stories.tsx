import React from 'react';
import { ControlTypes } from '@storybook/common';
import { BooleanEditor } from './BooleanEditor';

export default {
  title: 'Basics/PropEditors/BooleanEditor',
  component: BooleanEditor,
};

export const sample = () => {
  const [state, setState] = React.useState(false);
  return (
    <BooleanEditor
      name="prop"
      onChange={(name, newVal) => setState(newVal)}
      prop={{ type: ControlTypes.BOOLEAN, value: state }}
    />
  );
};
