import React from 'react';
import { PropertyTypes, ContextStoryProperties } from '@storybook/common';
import {
  Title,
  Subtitle,
  Description,
  Story,
  Props,
  Stories,
  PropEditorsTable,
} from '@storybook/addon-docs/blocks';
import { number } from '@storybook/addon-knobs';

export default {
  title: 'Docs/PropEditors/PropEditorsTable',
  component: PropEditorsTable,
  parameters: {
    docs: {
      page: () => (
        <>
          <Title />
          <Subtitle />
          <Description />
          <Story id="." />
          <PropEditorsTable />
          <Props />
          <Stories />
        </>
      ),
    },
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
    name: { type: PropertyTypes.TEXT, label: 'Name', value: 'Mark' },
    age: { type: PropertyTypes.NUMBER, label: 'Age', value: 19 },
    clickMe: {
      type: PropertyTypes.BUTTON,
      label: '+1',
      onClick: () => {},
    },
  },
};
