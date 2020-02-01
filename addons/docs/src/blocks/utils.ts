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

export const getAddons = (parameters: Parameters) =>
  (parameters && parameters.docs && parameters.docs.addons) || {};
