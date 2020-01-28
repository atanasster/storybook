import React, { FunctionComponent, Validator } from 'react';

import { styled } from '@storybook/theming';
import { StoryPropertyBoolean } from '@storybook/common';
import { PropertyControlProps, PropertyEditor } from '../types';

const Input = styled.input({
  display: 'table-cell',
  boxSizing: 'border-box',
  verticalAlign: 'top',
  height: 21,
  outline: 'none',
  border: '1px solid #ececec',
  fontSize: '12px',
  color: '#555',
});

interface BooleanEditorProps extends PropertyControlProps {
  prop: StoryPropertyBoolean;
}

export const BooleanEditor: PropertyEditor<BooleanEditorProps> = ({ prop, name, onChange }) => (
  <Input
    id={name}
    name={name}
    type="checkbox"
    onChange={e => onChange(name, e.target.checked)}
    checked={prop.value}
  />
);
