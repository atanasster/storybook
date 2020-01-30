import React, { ChangeEvent } from 'react';
import { StoryPropertyText } from '@storybook/common';
import { Form } from '../../form';
import { PropertyControlProps, PropertyEditor } from '../types';

interface TextEditorProps extends PropertyControlProps {
  prop: StoryPropertyText;
}

export const TextEditor: PropertyEditor<TextEditorProps> = ({ prop, name, onChange }) => {
  const { maxRows, minRows } = prop;
  return minRows > 1 || maxRows > 1 ? (
    <Form.Textarea
      id={name}
      name={name}
      value={prop.value}
      minRows={minRows}
      maxRows={maxRows}
      placeholder={prop.placeholder}
      onChange={(event: ChangeEvent<HTMLTextAreaElement>) => {
        const { value } = event.target;
        onChange(name, value);
      }}
      size="flex"
    />
  ) : (
    <Form.Input
      id={name}
      name={name}
      value={prop.value}
      placeholder={prop.placeholder}
      onChange={(event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        onChange(name, value);
      }}
      size="flex"
    />
  );
};
