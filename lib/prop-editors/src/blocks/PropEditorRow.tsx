import React from 'react';
import { ContextStoryProperty } from '@storybook/core-events';
import { ClientApi } from '@storybook/client-api';
import { getPropertyEditor } from '../index';
import { PropertyEditor } from '../types';

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
        <InputType prop={prop} name={name} onChange={onChange} onClick={onClick} />
      </td>
    </tr>
  );
};
