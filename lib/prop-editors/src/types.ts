import React from 'react';
import {
  StoryControl,
  ContextStoryControls,
  SetControlValueFn,
  ResetControlValueFn,
  ClickControlFn,
} from '@storybook/common';

export type PropertyOnClick = (prop: StoryControl) => any;
export interface PropertyControlProps {
  prop: StoryControl;
  name: string;
  onChange: (name: string, prop: any) => void;
  onClick?: PropertyOnClick;
}

export type PropertyEditor<T extends PropertyControlProps = any> = React.FC<T>;

export interface ExtraControlAction {
  title: string;
  onAction: (props: ControlsEditorsTableProps) => void;
}

export type ExtraControlActions = ExtraControlAction[];

export interface ControlsEditorsTableProps {
  title?: string;
  storyId?: string;
  controls?: ContextStoryControls;
  setControlValue?: SetControlValueFn;
  resetControlValue?: ResetControlValueFn;
  clickControl?: ClickControlFn;
  extraActions?: ExtraControlActions;
}