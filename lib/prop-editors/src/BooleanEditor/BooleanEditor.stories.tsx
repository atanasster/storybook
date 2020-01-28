import React from 'react';
import { PropertyTypes } from '@storybook/common';
import { BooleanEditor } from './BooleanEditor';

export default {
  title: 'Other/PropEditors/BooleanEditor',
  component: BooleanEditor,
};

export const sample = () => {
  const [state, setState] = React.useState(false);
  return (
    <BooleanEditor
      name="prop"
      onChange={(name, newVal) => setState(newVal)}
      prop={{ type: PropertyTypes.BOOLEAN, value: state }}
    />
  );
};
