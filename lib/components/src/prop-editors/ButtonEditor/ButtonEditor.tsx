import React from 'react';
import { styled } from '@storybook/theming';
import { StoryPropertyButton, StoryPropertyBoolean } from '@storybook/common';
import { Form } from '../../form';
import { PropertyControlProps, PropertyEditor, PropertyOnClick } from '../types';

const FlexButton = styled(Form.Button)({
  flex: '1 1',
});

interface ButtonEditorProps extends PropertyControlProps {
  prop: StoryPropertyButton;
  onClick: PropertyOnClick;
}

export const ButtonEditor: PropertyEditor<ButtonEditorProps> = ({ prop, name, onClick }) => (
  <FlexButton type="button" name={name} onClick={() => onClick(prop)}>
    {name}
  </FlexButton>
);
