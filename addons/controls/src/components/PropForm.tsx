import React, { ComponentType } from 'react';
import { Form } from '@storybook/components';
import { StoryProperties, StoryProperty } from '@storybook/api';
import { getPropertyEditor } from '@storybook/prop-editors';

interface PropFormProps {
  props: StoryProperties;
  onFieldChange: (name: string, newValue: any) => void;
  onFieldClick: (name: string, prop: StoryProperty) => void;
}

const InvalidType = () => <span>Invalid Type</span>;

export const PropForm: React.FC<PropFormProps> = ({ props, onFieldChange, onFieldClick }) => (
  <Form>
    {Object.keys(props).map(name => {
      const prop: StoryProperty = props[name];
      const InputType: ComponentType<any> = getPropertyEditor(prop.type) || InvalidType;

      return (
        <Form.Field key={name} label={!prop.hideLabel && `${prop.label || name}`}>
          <InputType prop={prop} name={name} onChange={onFieldChange} onClick={onFieldClick} />
        </Form.Field>
      );
    })}
  </Form>
);
