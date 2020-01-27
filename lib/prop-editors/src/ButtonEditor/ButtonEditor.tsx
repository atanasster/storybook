import React from 'react';
import { Form } from '@storybook/components';
import { StoryPropertyButton } from '@storybook/core-events';
import { PropertyControlProps, PropertyEditor, PropertyOnClick } from '../types';

interface ButtonEditorProps extends PropertyControlProps {
  prop: StoryPropertyButton;
  onClick: PropertyOnClick;
}

export const ButtonEditor: PropertyEditor<ButtonEditorProps> = ({ prop, name, onClick }) => (
  <Form.Button type="button" name={name} onClick={() => onClick(prop)}>
    {name}
  </Form.Button>
);
