import React, { ChangeEvent } from 'react';

import { Form } from '@storybook/components';
import { StoryPropertyText } from '@storybook/common';
import { PropertyControlProps, PropertyEditor } from '../types';

interface TextEditorProps extends PropertyControlProps {
  prop: StoryPropertyText;
}

export const TextEditor: PropertyEditor<TextEditorProps> = ({ prop, name, onChange }) => {
  return prop.maxRows > 1 ? (
    <Form.Textarea
      id={name}
      name={name}
      value={prop.value}
      maxRows={prop.maxRows}
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
