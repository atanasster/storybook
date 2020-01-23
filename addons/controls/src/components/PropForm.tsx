import React, { Component, ComponentType } from 'react';
import { StoryProperty } from '@storybook/api';
import { Form } from '@storybook/components';
import { getKnobControl } from './types';
import { StoryPropertiesArray } from '../KnobStore';

interface PropFormProps {
  props: StoryPropertiesArray;
  onFieldChange: (changedKnob: StoryProperty) => void;
  onFieldClick: (knob: StoryProperty) => void;
}

const InvalidType = () => <span>Invalid Type</span>;

export default class PropForm extends Component<PropFormProps> {
  static displayName = 'PropForm';

  static defaultProps = {
    props: [] as StoryPropertiesArray,
    onFieldChange: () => {},
    onFieldClick: () => {},
  };

  makeChangeHandler(name: string, type: string) {
    const { onFieldChange } = this.props;
    return (value = '') => {
      const change: StoryProperty = { name, type, value } as any;

      onFieldChange(change);
    };
  }

  render() {
    const { props, onFieldClick } = this.props;

    return (
      <Form>
        {props.map(prop => {
          const changeHandler = this.makeChangeHandler(prop.name, prop.type);
          const InputType: ComponentType<any> = getKnobControl(prop.type) || InvalidType;

          return (
            <Form.Field key={prop.name} label={!prop.hideLabel && `${prop.label || prop.name}`}>
              <InputType knob={prop} onChange={changeHandler} onClick={onFieldClick} />
            </Form.Field>
          );
        })}
      </Form>
    );
  }
}
