import {
  Addon,
  StoryFn,
  StoryContext,
  Parameters,
  StoryApi,
  DecoratorFunction,
} from '@storybook/addons';
import { StoryProperties, ContextStoryProperties } from '@storybook/common';
import StoryStore from './story_store';
import { HooksContext } from './hooks';

export interface ErrorLike {
  message: string;
  stack: string;
}

export interface StoreItem extends StoryContext {
  getDecorated: () => StoryFn;
  getOriginal: () => StoryFn;
  story: string;
  id: string;
  kind: string;
  name: string;
  storyFn: StoryFn;
  hooks: HooksContext;
  parameters: Parameters;
  properties?: ContextStoryProperties;
}

export interface StoreData {
  [key: string]: StoreItem;
}

export interface ClientApiParams {
  storyStore: StoryStore;
  decorateStory?: (storyFn: any, decorators: any) => any;
}

export type ClientApiReturnFn<StoryFnReturnType> = (...args: any[]) => StoryApi<StoryFnReturnType>;

export { StoryApi, DecoratorFunction };

export interface LegacyItem {
  fileName: string;
  index: number;
  kind: string;
  stories: { [key: string]: any };
  revision?: number;
  selection?: { storyId: string };
}

export interface AddStoryArgs {
  id: string;
  kind: string;
  name: string;
  storyFn: StoryFn;
  parameters: Parameters;
  properties: StoryProperties;
}

export interface LegacyData {
  [K: string]: LegacyItem;
}

export interface ClientApiAddon<StoryFnReturnType = unknown> extends Addon {
  apply: (a: StoryApi<StoryFnReturnType>, b: any[]) => any;
}

export interface ClientApiAddons<StoryFnReturnType> {
  [key: string]: ClientApiAddon<StoryFnReturnType>;
}
