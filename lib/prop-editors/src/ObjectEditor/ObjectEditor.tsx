import React, { ChangeEvent } from 'react';
import deepEqual from 'fast-deep-equal';
import { Form } from '@storybook/components';
import { StoryPropertyObject } from '@storybook/common';
import { PropertyControlProps, PropertyEditor } from '../types';

interface ObjectEditorState {
  string: string;
  valid: boolean;
  json?: object;
}

interface ObjectEditorProps extends PropertyControlProps {
  prop: StoryPropertyObject;
}

const serialize = (o: object): ObjectEditorState => {
  try {
    return {
      json: o,
      string: JSON.stringify(o),
      valid: true,
    };
  } catch (e) {
    return {
      json: o,
      string: 'Object cannot be stringified',
      valid: false,
    };
  }
};

export const ObjectEditor: PropertyEditor<ObjectEditorProps> = ({ prop, name, onChange }) => {
  const [state, setState] = React.useState<ObjectEditorState>(serialize(prop.value));
  React.useEffect(() => {
    setState(serialize(prop.value));
  }, [prop.value]);

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;
    const { json: stateJson } = state;
    try {
      const json = JSON.parse(value.trim());
      setState({
        string: value,
        json,
        valid: true,
      });
      if (deepEqual(prop.value, stateJson)) {
        onChange(name, json);
      }
    } catch (err) {
      setState({
        string: value,
        valid: false,
      });
    }
  };
  const { string, valid } = state;

  return (
    <Form.Textarea
      name={name}
      valid={valid ? undefined : 'error'}
      value={string}
      onChange={handleChange}
      size="flex"
    />
  );
};
