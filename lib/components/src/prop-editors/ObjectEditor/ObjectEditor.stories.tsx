import React from 'react';
import { ControlTypes } from '@storybook/common';
import { ObjectEditor } from './ObjectEditor';

export default {
  title: 'Basics/PropEditors/ObjectEditor',
  component: ObjectEditor,
};

export const sample = () => {
  const [state, setState] = React.useState({
    border: '2px dashed silver',
    borderRadius: 10,
    padding: 10,
  });
  return (
    <ObjectEditor
      name="prop"
      onChange={(name, newVal) => setState(newVal)}
      prop={{ type: ControlTypes.OBJECT, value: state }}
    />
  );
};
