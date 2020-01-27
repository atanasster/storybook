import React from 'react';
import { StoryProperty } from '@storybook/core-events';

export interface PropertyControlProps {
  prop: StoryProperty;
  name: string;
  onChange: (name: string, prop: any) => void;
}

export type PropertyEditor<T extends PropertyControlProps = any> = React.FC<T>;
