import React from 'react';
import { styled } from '@storybook/theming';
import { ComponentControlButton } from '@storybook/common';
import { Form } from '@storybook/components';
import { PropertyControlProps, PropertyEditor, PropertyOnClick } from '../types';

const FlexButton = styled(Form.Button)({
  flex: '1 1',
});

interface ButtonEditorProps extends PropertyControlProps {
  prop: ComponentControlButton;
  onClick: PropertyOnClick;
}

export const ButtonEditor: PropertyEditor<ButtonEditorProps> = ({ prop, name, onClick }) => (
  <FlexButton type="button" name={name} onClick={() => onClick(prop)}>
    {name}
  </FlexButton>
);
