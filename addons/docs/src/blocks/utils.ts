/* eslint-disable no-underscore-dangle */
import { Parameters } from '@storybook/addons';
import { DocsContextProps } from './DocsContext';
import { StoryData, Component } from './shared';

export const getDocsStories = (context: DocsContextProps): StoryData[] => {
  const { storyStore, selectedKind } = context;

  if (!storyStore) {
    return [];
  }

  return storyStore
    .getStoriesForKind(selectedKind)
    .filter((s: any) => !(s.parameters && s.parameters.docs && s.parameters.docs.disable));
};

export const getFirstStoryId = (docsContext: DocsContextProps): string => {
  const stories = getDocsStories(docsContext);
  return stories.length > 0 ? stories[0].id : null;
};

const titleCase = (str: string): string =>
  str
    .split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');

export const getComponentName = (component: Component): string => {
  if (!component) {
    return undefined;
  }

  if (typeof component === 'string') {
    if (component.includes('-')) {
      return titleCase(component);
    }
    return component;
  }
  if (component.__docgenInfo && component.__docgenInfo.displayName) {
    return component.__docgenInfo.displayName;
  }

  return component.name;
};

export function scrollToElement(element: any, block = 'start') {
  element.scrollIntoView({
    behavior: 'smooth',
    block,
    inline: 'nearest',
  });
}

export interface DocAddonsCallbackProps {
  storyId: string;
  context: DocsContextProps;
  [key: string]: any;
}

export type DocAddonsCallbackFn = (props: DocAddonsCallbackProps) => any;

export interface DocAddonProps {
  name: string;
  addon: any;
}

export const getAddons = (
  parameters: Parameters,
  section: string,
  props: DocAddonsCallbackProps
): DocAddonProps[] => {
  const addons =
    parameters && parameters.docs && parameters.docs.addons && parameters.docs.addons[section];
  if (addons) {
    return Object.keys(addons).map(name => ({
      name,
      addon: addons[name](props),
    }));
  }
  return [];
};
