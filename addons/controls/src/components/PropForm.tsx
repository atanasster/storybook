import React, { ComponentType } from 'react';
import { Form, getPropertyEditor } from '@storybook/components';
import { StoryControls, StoryControl } from '@storybook/common';

interface PropFormProps {
  props: StoryControls;
  onFieldChange: (name: string, newValue: any) => void;
  onFieldClick: (name: string, prop: StoryControl) => void;
}

const InvalidType = () => <span>Invalid Type</span>;

export const PropForm: React.FC<PropFormProps> = ({ props, onFieldChange, onFieldClick }) => (
  <Form>
    {Object.keys(props).map(name => {
      const prop: StoryControl = props[name];
      const InputType: ComponentType<any> = getPropertyEditor(prop.type) || InvalidType;

      return (
        <Form.Field key={name} label={!prop.hideLabel && `${prop.label || name}`}>
          <InputType prop={prop} name={name} onChange={onFieldChange} onClick={onFieldClick} />
        </Form.Field>
      );
    })}
  </Form>
);
