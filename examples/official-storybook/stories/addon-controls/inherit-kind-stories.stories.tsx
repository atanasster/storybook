import React from 'react';
import { PropertyTypes } from '@storybook/common';
import { PropEditorsTable } from '@storybook/addon-docs/blocks';

export default {
  title: 'Addons/Controls/kind',
  component: PropEditorsTable,
  properties: {
    name: { type: PropertyTypes.TEXT, label: 'Name', value: 'Mark' },
  },
};

interface DocsPropEditorsTable {
  name: string;
  age: number;
}
export const docsPropEditorsTable = ({ name, age }: DocsPropEditorsTable) => {
  return (
    <>
      <h2>{`Hello, my name is ${name}, and I am ${age} years old.`}</h2>
    </>
  );
};

docsPropEditorsTable.story = {
  properties: {
    age: { type: PropertyTypes.NUMBER, label: 'Age', value: 19 },
    clickMe: {
      type: PropertyTypes.BUTTON,
      label: '+1',
      onClick: () => {},
    },
  },
};
