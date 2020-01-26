import React from 'react';
import { PropertyTypes } from '@storybook/api';
import { ArrayEditor } from './ArrayEditor';

export default {
  title: 'Other/PropEditors/ArrayEditor',
  component: ArrayEditor,
};

export const sample = () => {
  const [state, setState] = React.useState(['Laptop', 'Book', 'Whiskey']);
  return (
    <>
      <ArrayEditor
        name="prop"
        onChange={(name, newVal) => setState(newVal)}
        prop={{ type: PropertyTypes.ARRAY, value: state }}
      />
      <ul>{state && state.map(item => <li key={item}>{item}</li>)}</ul>
    </>
  );
};
