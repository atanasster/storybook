import React from 'react';
import { ControlTypes } from '@storybook/common';
import { TextEditor } from './TextEditor';

export default {
  title: 'Basics/PropEditors/TextEditor',
  component: TextEditor,
};

export const simple = () => {
  const [state, setState] = React.useState('Hello');
  return (
    <TextEditor
      name="prop"
      onChange={(name, newVal) => setState(newVal)}
      prop={{ type: ControlTypes.TEXT, value: state }}
    />
  );
};

export const placeholder = () => {
  const [state, setState] = React.useState();
  return (
    <TextEditor
      name="prop"
      onChange={(name, newVal) => setState(newVal)}
      prop={{ type: ControlTypes.TEXT, value: state, placeholder: 'Enter some text' }}
    />
  );
};