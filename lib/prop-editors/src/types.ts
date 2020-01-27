import React from 'react';
import { StoryProperty } from '@storybook/core-events';

export type PropertyOnClick = (prop: StoryProperty) => any;
export interface PropertyControlProps {
  prop: StoryProperty;
  name: string;
  onChange: (name: string, prop: any) => void;
  onClick?: PropertyOnClick;
}

export type PropertyEditor<T extends PropertyControlProps = any> = React.FC<T>;
