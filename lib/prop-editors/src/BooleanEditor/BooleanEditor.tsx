import React from 'react';
import { StoryControlBoolean } from '@storybook/common';
import { Toggle } from './Toggle';
import { FlexContainer } from '../FlexContainer';
import { PropertyControlProps, PropertyEditor } from '../types';

interface BooleanEditorProps extends PropertyControlProps {
  prop: StoryControlBoolean;
}

export const BooleanEditor: PropertyEditor<BooleanEditorProps> = ({ prop, name, onChange }) => (
  <FlexContainer>
    <Toggle
      id={name}
      name={name}
      onChange={checked => onChange(name, checked)}
      checked={prop.value}
    />
  </FlexContainer>
);
