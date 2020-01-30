import React from 'react';
import { ControlTypes } from '@storybook/common';
import { ControlsEditorsTable } from '@storybook/addon-docs/blocks';

export default {
  title: 'Addons/Controls/kind',
  component: ControlsEditorsTable,
  properties: {
    name: { type: ControlTypes.TEXT, label: 'Name', value: 'Mark', order: 9999 },
  },
};

interface DocsControlsEditorsTable {
  name: string;
  age: number;
}
export const docsControlsEditorsTable = ({ name, age }: DocsControlsEditorsTable) => {
  return (
    <>
      <h2>{`Hello, my name is ${name}, and I am ${age} years old.`}</h2>
    </>
  );
};

docsControlsEditorsTable.story = {
  properties: {
    age: { type: ControlTypes.NUMBER, label: 'Age', value: 19, order: 2 },
    clickMe: {
      type: ControlTypes.BUTTON,
      label: '+1',
      onClick: () => {},
      order: 1,
    },
  },
};
