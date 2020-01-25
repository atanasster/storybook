import React from 'react';
import { PropertyTypes } from '@storybook/api';
import { TextEditor } from './TextEditor';

export default {
  title: 'Other/TextEditor',
  component: TextEditor,
};

export const simple = () => {
  const [state, setState] = React.useState('Hello');
  return (
    <TextEditor
      name="prop"
      onChange={(name, newVal) => setState(newVal)}
      prop={{ type: PropertyTypes.TEXT, value: state }}
    />
  );
};

export const placeholder = () => {
  const [state, setState] = React.useState();
  return (
    <TextEditor
      name="prop"
      onChange={(name, newVal) => setState(newVal)}
      prop={{ type: PropertyTypes.TEXT, value: state, placeholder: 'Enter some text' }}
    />
  );
};
