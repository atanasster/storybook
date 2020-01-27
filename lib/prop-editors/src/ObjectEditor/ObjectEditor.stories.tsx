import React from 'react';
import { PropertyTypes } from '@storybook/core-events';
import { ObjectEditor } from './ObjectEditor';

export default {
  title: 'Other/PropEditors/ObjectEditor',
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
      prop={{ type: PropertyTypes.OBJECT, value: state }}
    />
  );
};
