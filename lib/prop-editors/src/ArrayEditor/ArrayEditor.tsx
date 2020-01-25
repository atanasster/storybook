import React, { ChangeEvent } from 'react';
import { StoryPropertyArray } from '@storybook/api';
import { Form } from '@storybook/components';
import { PropertyControlProps, PropertyEditor } from '../types';

interface ArrayEditorProps extends PropertyControlProps {
  prop: StoryPropertyArray;
}

const formatArray = (value: string, separator: string) => {
  if (value === '') {
    return [];
  }
  return value.split(separator);
};

const deserialize = (value: string[]) => {
  if (Array.isArray(value)) return value;
  return Object.keys(value)
    .sort()
    .reduce((array, key) => [...array, value[key]], []);
};

export const ArrayEditor: PropertyEditor<ArrayEditorProps> = ({ prop, name, onChange }) => {
  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>): void => {
    const { value } = e.target as HTMLTextAreaElement;
    const newVal = formatArray(value, prop.separator || ',');
    onChange(name, newVal);
  };

  const value = prop.value && deserialize(prop.value).join(prop.separator);

  return <Form.Textarea id={name} name={name} value={value} onChange={handleChange} size="flex" />;
};
