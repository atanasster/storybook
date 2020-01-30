import React from 'react';
import { ControlTypes } from '@storybook/common';
import { ButtonEditor } from './ButtonEditor';

export default {
  title: 'Basics/PropEditors/ButtonEditor',
  component: ButtonEditor,
};

export const sample = () => (
  <ButtonEditor
    name="Check in console"
    onClick={() => console.log('clicked')}
    onChange={() => {}}
    prop={{ type: ControlTypes.BUTTON }}
  />
);
