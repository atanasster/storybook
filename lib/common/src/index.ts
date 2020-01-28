import { StoryProperty } from './properties';

export * from './properties';
export type ContextStoryProperty = StoryProperty & { defaultValue: any };
export interface ContextStoryProperties {
  [key: string]: ContextStoryProperty;
}
export * from './prop-utils';
