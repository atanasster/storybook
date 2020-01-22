import { StoryProperty } from '@storybook/api';

export interface KnobControlConfig<T = never> {
  name: string;
  value: T;
  defaultValue?: T;
}

export interface KnobControlProps<T> {
  knob: StoryProperty;
  onChange: (value: T) => T;
}
