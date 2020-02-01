import React, { ChangeEvent } from 'react';
import { styled } from '@storybook/theming';
import deepEqual from 'fast-deep-equal';
import { StoryControlObject } from '@storybook/common';
import { Form } from '@storybook/components';
import { PropertyControlProps, PropertyEditor } from '../types';

const StyledFlexArea = styled(Form.Textarea)({
  flexGrow: 1,
});

interface ObjectEditorState {
  string: string;
  valid: boolean;
  json?: object;
}

interface ObjectEditorProps extends PropertyControlProps {
  prop: StoryControlObject;
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
  const { maxRows, minRows = 5 } = prop;
  return (
    <StyledFlexArea
      name={name}
      valid={valid ? undefined : 'error'}
      value={string}
      maxRows={maxRows}
      minRows={minRows}
      onChange={handleChange}
      size="100%"
    />
  );
};
