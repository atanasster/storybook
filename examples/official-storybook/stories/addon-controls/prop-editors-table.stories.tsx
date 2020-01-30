import React from 'react';
import { ControlTypes } from '@storybook/common';
import {
  Title,
  Subtitle,
  Description,
  Story,
  Props,
  Stories,
  ControlsEditorsTable,
} from '@storybook/addon-docs/blocks';

export default {
  title: 'Docs/PropEditors/ControlsEditorsTable',
  component: ControlsEditorsTable,
  parameters: {
    docs: {
      page: () => (
        <>
          <Title />
          <Subtitle />
          <Description />
          <Story id="." />
          <ControlsEditorsTable />
          <Props />
          <Stories />
        </>
      ),
    },
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
  controls: {
    name: { type: ControlTypes.TEXT, label: 'Name', value: 'Mark' },
    age: { type: ControlTypes.NUMBER, label: 'Age', value: 19 },
    clickMe: {
      type: ControlTypes.BUTTON,
      label: '+1',
      onClick: () => {},
    },
  },
};
