import React from 'react';
import { PropertyTypes } from '@storybook/core-events';
import { DateEditor } from './DateEditor';

export default {
  title: 'Other/PropEditors/DateEditor',
  component: DateEditor,
};

export const sample = () => {
  const [state, setState] = React.useState(new Date());
  return (
    <DateEditor
      name="prop"
      onChange={(name, newVal) => setState(newVal)}
      prop={{ type: PropertyTypes.DATE, value: state }}
    />
  );
};

export const onlyDatePicker = () => {
  const [state, setState] = React.useState(new Date());
  return (
    <DateEditor
      name="prop"
      onChange={(name, newVal) => setState(newVal)}
      prop={{ type: PropertyTypes.DATE, value: state, timePicker: false }}
    />
  );
};

export const onlyTimePicker = () => {
  const [state, setState] = React.useState(new Date());
  return (
    <DateEditor
      name="prop"
      onChange={(name, newVal) => setState(newVal)}
      prop={{ type: PropertyTypes.DATE, value: state, datePicker: false }}
    />
  );
};
