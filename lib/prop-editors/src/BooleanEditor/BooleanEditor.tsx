import React from 'react';
import { ComponentControlBoolean } from '@component-controls/specification';
import { Toggle } from './Toggle';
import { FlexContainer } from '../FlexContainer';
import { PropertyControlProps, PropertyEditor } from '../types';

interface BooleanEditorProps extends PropertyControlProps {
  prop: ComponentControlBoolean;
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
