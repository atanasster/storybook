import React from 'react';
import { styled } from '@storybook/theming';

import {
  ContextStoryControl,
  SetControlValueFn,
  ResetControlValueFn,
  ClickControlFn,
} from '@storybook/common';
import { getPropertyEditor } from './prop-factory';
import { PropertyEditor } from './types';

export interface EditorContainerProps {
  align?: string;
}
export const EditorContainer = styled.div<EditorContainerProps>(({ align = 'center' }) => ({
  display: 'flex',
  alignItems: align,
  justifyContent: align,
}));
const InvalidType = () => <span>Invalid Type</span>;

interface PropertyEditorRowProps {
  prop: ContextStoryControl;
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
        <EditorContainer align="left">
          <InputType prop={prop} name={name} onChange={onChange} onClick={onClick} />
        </EditorContainer>
      </td>
    </tr>
  );
};
