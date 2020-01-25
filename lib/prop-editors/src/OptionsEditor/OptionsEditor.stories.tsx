import React from 'react';
import { PropertyTypes } from '@storybook/api';
import { OptionsEditor } from './OptionsEditor';

export default {
  title: 'Other/PropEditors/OptionsEditor',
  component: OptionsEditor,
};

export const simple = () => {
  const [state, setState] = React.useState('one');
  return (
    <OptionsEditor
      name="prop"
      onChange={(name, newVal) => setState(newVal)}
      prop={{ type: PropertyTypes.OPTIONS, value: state, options: ['one', 'two', 'three'] }}
    />
  );
};

export const objects = () => {
  const [state, setState] = React.useState('one');
  return (
    <OptionsEditor
      name="prop"
      onChange={(name, newVal) => setState(newVal)}
      prop={{
        type: PropertyTypes.OPTIONS,
        value: state,
        options: { one: 'One', two: 'Two', three: 'Three' },
      }}
    />
  );
};

export const numeric = () => {
  const [state, setState] = React.useState(1);
  return (
    <OptionsEditor
      name="prop"
      onChange={(name, newVal) => setState(newVal)}
      prop={{
        type: PropertyTypes.OPTIONS,
        value: state,
        options: [
          { value: 1, label: 'One' },
          { value: 2, label: 'Two' },
          { value: 3, label: 'Three' },
        ],
      }}
    />
  );
};

export const multiSelectSimple = () => {
  const [state, setState] = React.useState(['one']);
  return (
    <OptionsEditor
      name="prop"
      onChange={(name, newVal) => setState(newVal)}
      prop={{
        type: PropertyTypes.OPTIONS,
        value: state,
        options: ['one', 'two', 'three'],
        display: 'multi-select',
      }}
    />
  );
};

export const multiSelectObjects = () => {
  const [state, setState] = React.useState(['one']);
  return (
    <OptionsEditor
      name="prop"
      onChange={(name, newVal) => setState(newVal)}
      prop={{
        type: PropertyTypes.OPTIONS,
        value: state,
        options: { one: 'One', two: 'Two', three: 'Three' },
        display: 'multi-select',
      }}
    />
  );
};

export const multiSelectNumeric = () => {
  const [state, setState] = React.useState([1]);
  return (
    <OptionsEditor
      name="prop"
      onChange={(name, newVal) => setState(newVal)}
      prop={{
        type: PropertyTypes.OPTIONS,
        value: state,
        options: [
          { value: 1, label: 'One' },
          { value: 2, label: 'Two' },
          { value: 3, label: 'Three' },
        ],
        display: 'multi-select',
      }}
    />
  );
};

export const simpleRadios = () => {
  const [state, setState] = React.useState('one');
  return (
    <OptionsEditor
      name="prop"
      onChange={(name, newVal) => setState(newVal)}
      prop={{
        type: PropertyTypes.OPTIONS,
        value: state,
        options: ['one', 'two', 'three'],
        display: 'radio',
      }}
    />
  );
};

export const objectsRadios = () => {
  const [state, setState] = React.useState('one');
  return (
    <OptionsEditor
      name="prop"
      onChange={(name, newVal) => setState(newVal)}
      prop={{
        type: PropertyTypes.OPTIONS,
        value: state,
        options: { one: 'One', two: 'Two', three: 'Three' },
        display: 'radio',
      }}
    />
  );
};

export const numericRadios = () => {
  const [state, setState] = React.useState(1);
  return (
    <OptionsEditor
      name="prop"
      onChange={(name, newVal) => setState(newVal)}
      prop={{
        type: PropertyTypes.OPTIONS,
        value: state,
        options: [
          { value: 1, label: 'One' },
          { value: 2, label: 'Two' },
          { value: 3, label: 'Three' },
        ],
        display: 'radio',
      }}
    />
  );
};

export const simpleRadiosInline = () => {
  const [state, setState] = React.useState('one');
  return (
    <OptionsEditor
      name="prop"
      onChange={(name, newVal) => setState(newVal)}
      prop={{
        type: PropertyTypes.OPTIONS,
        value: state,
        options: ['one', 'two', 'three'],
        display: 'inline-radio',
      }}
    />
  );
};

export const objectsRadiosInline = () => {
  const [state, setState] = React.useState('one');
  return (
    <OptionsEditor
      name="prop"
      onChange={(name, newVal) => setState(newVal)}
      prop={{
        type: PropertyTypes.OPTIONS,
        value: state,
        options: { one: 'One', two: 'Two', three: 'Three' },
        display: 'inline-radio',
      }}
    />
  );
};

export const numericRadiosInline = () => {
  const [state, setState] = React.useState(1);
  return (
    <OptionsEditor
      name="prop"
      onChange={(name, newVal) => setState(newVal)}
      prop={{
        type: PropertyTypes.OPTIONS,
        value: state,
        options: [
          { value: 1, label: 'One' },
          { value: 2, label: 'Two' },
          { value: 3, label: 'Three' },
        ],
        display: 'inline-radio',
      }}
    />
  );
};

export const simpleCheck = () => {
  const [state, setState] = React.useState('one');
  return (
    <OptionsEditor
      name="prop"
      onChange={(name, newVal) => setState(newVal)}
      prop={{
        type: PropertyTypes.OPTIONS,
        value: state,
        options: ['one', 'two', 'three'],
        display: 'check',
      }}
    />
  );
};

export const objectsCheck = () => {
  const [state, setState] = React.useState('one');
  return (
    <OptionsEditor
      name="prop"
      onChange={(name, newVal) => setState(newVal)}
      prop={{
        type: PropertyTypes.OPTIONS,
        value: state,
        options: { one: 'One', two: 'Two', three: 'Three' },
        display: 'check',
      }}
    />
  );
};

export const numericCheck = () => {
  const [state, setState] = React.useState(1);
  return (
    <OptionsEditor
      name="prop"
      onChange={(name, newVal) => setState(newVal)}
      prop={{
        type: PropertyTypes.OPTIONS,
        value: state,
        options: [
          { value: 1, label: 'One' },
          { value: 2, label: 'Two' },
          { value: 3, label: 'Three' },
        ],
        display: 'check',
      }}
    />
  );
};

export const simpleCheckInline = () => {
  const [state, setState] = React.useState('one');
  return (
    <OptionsEditor
      name="prop"
      onChange={(name, newVal) => setState(newVal)}
      prop={{
        type: PropertyTypes.OPTIONS,
        value: state,
        options: ['one', 'two', 'three'],
        display: 'inline-check',
      }}
    />
  );
};

export const objectsCheckInline = () => {
  const [state, setState] = React.useState('one');
  return (
    <OptionsEditor
      name="prop"
      onChange={(name, newVal) => setState(newVal)}
      prop={{
        type: PropertyTypes.OPTIONS,
        value: state,
        options: { one: 'One', two: 'Two', three: 'Three' },
        display: 'inline-check',
      }}
    />
  );
};

export const numericCheckInline = () => {
  const [state, setState] = React.useState(1);
  return (
    <OptionsEditor
      name="prop"
      onChange={(name, newVal) => setState(newVal)}
      prop={{
        type: PropertyTypes.OPTIONS,
        value: state,
        options: [
          { value: 1, label: 'One' },
          { value: 2, label: 'Two' },
          { value: 3, label: 'Three' },
        ],
        display: 'inline-check',
      }}
    />
  );
};
