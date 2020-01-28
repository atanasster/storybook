import React from 'react';
import { PropertyTypes } from '@storybook/common';
import { NumberEditor } from './NumberEditor';

export default {
  title: 'Other/PropEditors/NumberEditor',
  component: NumberEditor,
};

export const simple = () => {
  const [value, setValue] = React.useState(10);
  return (
    <NumberEditor
      name="prop"
      onChange={(nama, newValue) => setValue(newValue)}
      prop={{ type: PropertyTypes.NUMBER, value, min: 3, max: 22 }}
    />
  );
};

export const range = () => {
  const [value, setValue] = React.useState(10);
  return (
    <NumberEditor
      name="prop"
      onChange={(nama, newValue) => setValue(newValue)}
      prop={{ type: PropertyTypes.NUMBER, value, min: 3, max: 22, range: true }}
    />
  );
};

export const step = () => {
  const [value, setValue] = React.useState(10);
  return (
    <NumberEditor
      name="prop"
      onChange={(nama, newValue) => setValue(newValue)}
      prop={{ type: PropertyTypes.NUMBER, value, min: 3, max: 22, step: 0.5 }}
    />
  );
};
