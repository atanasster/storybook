import { StoryControl } from './story-controls';

export * from './story-controls';
export type ContextStoryControl = StoryControl & { defaultValue?: any };
export interface ContextStoryControls {
  [key: string]: ContextStoryControl;
}
export * from './controls-utils';
