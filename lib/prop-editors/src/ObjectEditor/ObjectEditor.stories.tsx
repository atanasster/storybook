import React from 'react';
import { ControlTypes, ComponentControls } from '@storybook/common';
import { ObjectEditor } from './ObjectEditor';

export default {
  title: 'Basics/PropEditors/ObjectEditor',
  component: ObjectEditor,
};

export const sample = () => {
  const [state, setState] = React.useState<ComponentControls>({
    border: { type: ControlTypes.TEXT, value: '2px dashed silver' },
    borderRadius: { type: ControlTypes.NUMBER, value: 10 },
    padding: { type: ControlTypes.NUMBER, value: 10 },
  });

  return (
    <ObjectEditor
      name="prop"
      onChange={(_name, newVal) => setState(newVal)}
      prop={{ type: ControlTypes.OBJECT, value: state }}
    />
  );
};
