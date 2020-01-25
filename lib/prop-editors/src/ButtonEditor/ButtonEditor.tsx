import React from 'react';
import { Form } from '@storybook/components';
import { StoryPropertyButton } from '@storybook/api';
import { PropertyControlProps, PropertyEditor } from '../types';

type ButtonEditorOnClickProp = (prop: StoryPropertyButton) => any;

interface ButtonEditorProps extends PropertyControlProps {
  prop: StoryPropertyButton;
  onClick: ButtonEditorOnClickProp;
}

export const ButtonEditor: PropertyEditor<ButtonEditorProps> = ({ prop, name, onClick }) => (
  <Form.Button type="button" name={name} onClick={() => onClick(prop)}>
    {name}
  </Form.Button>
);
