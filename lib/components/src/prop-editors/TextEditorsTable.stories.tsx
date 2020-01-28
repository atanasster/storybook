import React from 'react';
import { PropertyTypes, ContextStoryProperties } from '@storybook/common';
import { PropEditorsTable } from './PropEditorsTable';

export default {
  title: 'Docs/PropEditors/PropEditorsTable',
  component: PropEditorsTable,
};

export const purePropEditorsTable = () => {
  const [properties, setProperties] = React.useState<ContextStoryProperties>({
    name: { type: PropertyTypes.TEXT, label: 'Name', value: 'Mark', defaultValue: 'Mark' },
    age: { type: PropertyTypes.NUMBER, label: 'Age', value: 19, defaultValue: 19 },
    clickMe: {
      type: PropertyTypes.BUTTON,
      label: '+1',
      onClick: () => {},
    },
  });

  return (
    <>
      <h2>{`Hello, my name is ${properties.name.value}, and I am ${properties.age.value} years old.`}</h2>
      <PropEditorsTable
        properties={properties as ContextStoryProperties}
        title="Example properties"
        storyId="1-11"
        setPropertyValue={(storyId, name, value) =>
          setProperties({
            ...properties,
            [name]: { ...properties[name], value },
          })
        }
        clickProperty={() =>
          setProperties({
            ...properties,
            age: { ...properties.age, value: parseInt(properties.age.value, 10) + 1 },
          })
        }
      />
    </>
  );
};
