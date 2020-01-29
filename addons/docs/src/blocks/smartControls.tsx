import { StoryProperties, StoryProperty, PropertyTypes } from '@storybook/common';
import { PropDef } from '@storybook/components';

export type SmartControls = boolean | string[];
export const createFieldFromProps = (
  propDef: PropDef,
  properties: StoryProperties,
  smartControls: SmartControls
): StoryProperty | null | undefined => {
  if (!smartControls) {
    return null;
  }
  if (Array.isArray(smartControls) && !smartControls.includes(propDef.name)) {
    return null;
  }
  if (!properties) {
    return null;
  }
  if (properties && Object.keys(properties).length) {
    return properties[propDef.name];
  }
  switch (propDef.type.type) {
    case 'string': {
      let value: string | undefined =
        typeof propDef.defaultValue === 'string' ? propDef.defaultValue : undefined;
      const isColor = propDef.name.includes('color');
      if (!value && propDef.required) {
        value = isColor ? 'red' : 'example';
      }
      return {
        type: isColor ? PropertyTypes.COLOR : PropertyTypes.TEXT,
        value,
      };
    }
    case 'bool': {
      let value;
      if (propDef.defaultValue.summary === 'false') {
        value = false;
      }
      if (propDef.defaultValue.summary === 'true') {
        value = true;
      }
      return { type: PropertyTypes.BOOLEAN, value };
    }
    case 'enum': {
      const value = propDef.defaultValue
        ? propDef.defaultValue.summary.replace(/['"]+/g, '')
        : undefined;
      return {
        type: PropertyTypes.OPTIONS,
        options: propDef.type.value.map((v: any) => v.value.replace(/['"]+/g, '')),
        value,
      };
    }
    default:
      return null;
  }
};
