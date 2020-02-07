import React from 'react';
import {
  LoadedComponentControl,
  SetControlValueFn,
  ResetControlValueFn,
  ClickControlFn,
} from '@component-controls/specification';
import { getPropertyEditor } from './prop-factory';
import { FlexContainer } from './FlexContainer';
import { PropertyEditor } from './types';

const InvalidType = () => <span>Invalid Type</span>;

interface PropertyEditorRowProps {
  prop: LoadedComponentControl;
  name: string;
  storyId?: string;
  setControlValue?: SetControlValueFn;
  resetControlValue?: ResetControlValueFn;
  clickControl?: ClickControlFn;
}

export const PropertyEditorRow: React.FunctionComponent<PropertyEditorRowProps> = ({
  prop,
  name,
  setControlValue,
  clickControl,
  storyId,
}) => {
  const InputType: PropertyEditor = getPropertyEditor(prop.type) || InvalidType;
  const onChange = (propName: string, value: any) => {
    if (setControlValue && storyId) {
      setControlValue(storyId, propName, value);
    }
  };
  const onClick = () => {
    if (clickControl && storyId) {
      clickControl(storyId, name);
    }
  };
  return (
    <tr>
      <td>{!prop.hideLabel ? prop.label || name : null}</td>
      <td>
        <FlexContainer align="left">
          <InputType prop={prop} name={name} onChange={onChange} onClick={onClick} />
        </FlexContainer>
      </td>
    </tr>
  );
};
