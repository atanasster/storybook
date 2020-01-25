import React, { ChangeEvent } from 'react';

import { Form } from '@storybook/components';
import { StoryPropertyText } from '@storybook/api';
import { PropertyControlProps, PropertyEditor } from '../types';

interface TextEditorProps extends PropertyControlProps {
  prop: StoryPropertyText;
}

export const TextEditor: PropertyEditor<TextEditorProps> = ({ prop, name, onChange }) => (
  <Form.Textarea
    id={name}
    name={name}
    value={prop.value}
    placeholder={prop.placeholder}
    onChange={(event: ChangeEvent<HTMLTextAreaElement>) => {
      const { value } = event.target;
      onChange(name, value);
    }}
    size="flex"
  />
);
