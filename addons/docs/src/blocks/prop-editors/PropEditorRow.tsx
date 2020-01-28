import React from 'react';
import { styled } from '@storybook/theming';

import { ContextStoryProperty } from '@storybook/common';
import { ClientApi } from '@storybook/client-api';
import { getPropertyEditor, PropertyEditor } from '@storybook/prop-editors';

const EditorContainer = styled.div<{}>(({ theme }) => ({
  display: 'flex',
}));
const InvalidType = () => <span>Invalid Type</span>;

interface PropertyEditorRowProps {
  prop: ContextStoryProperty;
  name: string;
  storyId: string;
  api: ClientApi;
}

export const PropertyEditorRow: React.FunctionComponent<PropertyEditorRowProps> = ({
  prop,
  name,
  api,
  storyId,
}) => {
  const InputType: PropertyEditor = getPropertyEditor(prop.type) || InvalidType;
  const onChange = (propName: string, value: any) => {
    api.setPropertyValue(storyId, propName, value);
  };
  const onClick = () => {
    api.clickProperty(storyId, name, prop);
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
