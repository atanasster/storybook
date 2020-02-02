import { StoryControl } from '.';

export type ContextStoryControl = StoryControl & { defaultValue: any };
export interface ContextStoryControls {
  [name: string]: ContextStoryControl;
}

export const mergeControlValues = (
  properties: ContextStoryControls,
  propertyName: string | undefined,
  value: any
): ContextStoryControls => {
  return propertyName
    ? {
        ...properties,
        [propertyName]: { ...properties[propertyName], value },
      }
    : Object.keys(properties).reduce(
        (acc, key) => ({
          ...acc,
          [key]: {
            ...properties[key],
            value: value[key] === undefined ? properties[key].value : value[key],
          },
        }),
        {}
      );
};

export const resetControlValues = (properties: ContextStoryControls, propertyName?: string) => {
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
