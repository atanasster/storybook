import { StoryProperty } from './properties';

export type ContextStoryProperty = StoryProperty & { defaultValue: any };
export interface ContextStoryProperties {
  [name: string]: ContextStoryProperty;
}

export const mergePropertyValues = (
  properties: ContextStoryProperties,
  propertyName: string | undefined,
  value: any
): ContextStoryProperties => {
  return propertyName
    ? {
        ...properties,
        [propertyName]: { ...properties[propertyName], value },
      }
    : Object.keys(properties).reduce(
        (acc, key) => ({ ...acc, [key]: { ...properties[key], value: value[key] } }),
        {}
      );
};

export const resetPropertyValues = (
  properties: ContextStoryProperties,
  propertyName: string | undefined
) => {
  return propertyName
    ? {
        ...properties,
        [propertyName]: {
          ...properties[propertyName],
          value: properties[propertyName].defaultValue,
        },
      }
    : Object.keys(properties).reduce(
        (acc, key) => ({
          ...acc,
          [key]: { ...properties[key], value: properties[key].defaultValue },
        }),
        {}
      );
};
