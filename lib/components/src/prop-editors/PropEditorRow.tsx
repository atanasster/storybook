import React from 'react';
import { styled } from '@storybook/theming';

import { ContextStoryProperty } from '@storybook/common';
import { getPropertyEditor } from './prop-factory';
import { PropertyEditor, OnSetPropertyValue, OnResetPropertyValue, OnClickProperty } from './types';

const EditorContainer = styled.div<{}>(({ theme }) => ({
  display: 'flex',
}));
const InvalidType = () => <span>Invalid Type</span>;

interface PropertyEditorRowProps {
  prop: ContextStoryProperty;
  name: string;
  storyId?: string;
  setPropertyValue?: OnSetPropertyValue;
  resetPropertyValue?: OnResetPropertyValue;
  clickProperty?: OnClickProperty;
}

export const PropertyEditorRow: React.FunctionComponent<PropertyEditorRowProps> = ({
  prop,
  name,
  setPropertyValue,
  clickProperty,
  storyId,
}) => {
  const InputType: PropertyEditor = getPropertyEditor(prop.type) || InvalidType;
  const onChange = (propName: string, value: any) => {
    if (setPropertyValue && storyId) {
      setPropertyValue(storyId, propName, value);
    }
  };
  const onClick = () => {
    if (clickProperty && storyId) {
      clickProperty(storyId, name, prop);
    }
  };
  return (
    <tr>
      <td>{!prop.hideLabel ? prop.label || name : null}</td>
      <td>
        <EditorContainer>
          <InputType prop={prop} name={name} onChange={onChange} onClick={onClick} />
        </EditorContainer>
      </td>
    </tr>
  );
};
