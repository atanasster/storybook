/* eslint-disable no-console */
import { StoryProperties, StoryProperty, PropertyTypes } from '@storybook/common';
import { Parameters } from '@storybook/addons';
import { PropsTableRowsProps, PropDef } from '@storybook/components';
import { PropsExtractor } from '../lib/docgen/types';
import { inferPropsExtractor } from './propExtract';

export interface SmartControlsConfig {
  include?: string[];
  exclude?: string[];
}
export type SmartControls = boolean | SmartControlsConfig;

const cleanQuotes = (txt?: string) => (txt ? txt.replace(/['"]+/g, '') : txt);

export const createFieldFromProps = (
  propDef: PropDef,
  smartControls: SmartControls
): StoryProperty | null | undefined => {
  if (typeof smartControls === 'object') {
    const { include, exclude } = smartControls;
    if (Array.isArray(include) && !include.includes(propDef.name)) {
      return null;
    }
    if (Array.isArray(exclude) && exclude.includes(propDef.name)) {
      return null;
    }
  }
  switch (propDef.type.type) {
    case 'string': {
      let value: string | undefined;
      if (typeof propDef.defaultValue === 'string') {
        value = propDef.defaultValue;
      } else if (propDef.defaultValue && typeof propDef.defaultValue.summary === 'string') {
        value = propDef.defaultValue.summary;
      }
      value = cleanQuotes(value);
      const isColor = propDef.name.toLowerCase().includes('color');
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
    case 'number': {
      let value;
      try {
        value = parseFloat(propDef.defaultValue.summary);
      } catch (e) {
        // eat exceptoin
      }
      return { type: PropertyTypes.NUMBER, value };
    }
    case 'enum': {
      const value = propDef.defaultValue ? cleanQuotes(propDef.defaultValue.summary) : undefined;
      const options = Array.isArray(propDef.type) ? propDef.type : propDef.type.value;
      if (!Array.isArray(options)) {
        return null;
      }
      return {
        type: PropertyTypes.OPTIONS,
        options: options.map((v: any) => cleanQuotes(v.value)),
        value,
      };
    }
    case 'func': {
      return {
        type: PropertyTypes.BUTTON,
        label: propDef.name,
        onClick() {
          // eslint-disable-next-line prefer-rest-params
          console.info(`${propDef.name}: `, arguments);
        },
      };
    }
    case 'shape': {
      let value;
      try {
        if (propDef.defaultValue) {
          value = JSON.parse(propDef.defaultValue.summary);
        }
      } catch (e) {
        // eat exception
      }
      return {
        type: PropertyTypes.OBJECT,
        maxRows: 10,
        value,
      };
    }
    default:
      return null;
  }
};

export const extractSmartProperties = (parameters: Parameters): StoryProperties => {
  const params = parameters || {};
  const { component, framework = null, smartControls } = params;
  if (!smartControls) {
    return null;
  }
  if (!component) {
    return null;
  }
  const { extractProps = inferPropsExtractor(framework) }: { extractProps: PropsExtractor } =
    params.docs || {};
  if (!extractProps) {
    return null;
  }
  const props = extractProps(component);
  const { rows } = props as PropsTableRowsProps;

  const smartProps = rows
    ? rows.reduce((acc, row) => {
        const field = createFieldFromProps(row, smartControls);
        if (field) {
          return { ...acc, [row.name]: field };
        }
        return acc;
      }, {})
    : undefined;
  return smartProps;
};
