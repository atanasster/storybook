import React from 'react';
import { StoryControl, ContextStoryControls } from '@storybook/common';

export type PropertyOnClick = (prop: StoryControl) => any;
export interface PropertyControlProps {
  prop: StoryControl;
  name: string;
  onChange: (name: string, prop: any) => void;
  onClick?: PropertyOnClick;
}

export type PropertyEditor<T extends PropertyControlProps = any> = React.FC<T>;

export type OnSetControlValue = (storyId: string, propName: string, value: any) => void;
export type OnResetControlValue = (storyId: string, propName?: string) => void;
export type OnClickControl = (storyId: string, propName: string, property: StoryControl) => void;

export interface ControlsEditorsTableProps {
  title?: string;
  storyId?: string;
  controls?: ContextStoryControls;
  setControlValue?: OnSetControlValue;
  resetControlValue?: OnResetControlValue;
  clickControl?: OnClickControl;
}
