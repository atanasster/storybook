import React from 'react';
import { ContextStoryProperty, ContextStoryProperties } from '@storybook/common';

export type PropertyOnClick = (prop: ContextStoryProperty) => any;
export interface PropertyControlProps {
  prop: ContextStoryProperty;
  name: string;
  onChange: (name: string, prop: any) => void;
  onClick?: PropertyOnClick;
}

export type PropertyEditor<T extends PropertyControlProps = any> = React.FC<T>;

export type OnSetPropertyValue = (storyId: string, propName: string, value: any) => void;
export type OnResetPropertyValue = (storyId: string, propName: string) => void;
export type OnClickProperty = (
  storyId: string,
  propName: string,
  property: ContextStoryProperty
) => void;

export interface PropEditorsTableProps {
  title?: string;
  storyId?: string;
  properties?: ContextStoryProperties;
  setPropertyValue?: OnSetPropertyValue;
  resetPropertyValue?: OnResetPropertyValue;
  clickProperty?: OnClickProperty;
}
