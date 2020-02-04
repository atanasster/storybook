/* eslint-disable no-console */
import { StoryControls, StoryControl, ControlTypes } from '@storybook/common';
import { Parameters } from '@storybook/addons';
import { PropDef } from '@storybook/components';
import { inferPropsExtractor, getInputRows } from '@storybook/addon-docs/blocks';

export interface SmartControlsConfig {
  include?: string[];
  exclude?: string[];
}
export type SmartControls = boolean | SmartControlsConfig;

const cleanQuotes = (txt?: string) => (txt ? txt.replace(/['"]+/g, '') : txt);

export const createFieldFromProps = (
  propDef: PropDef,
  smartControls: SmartControls
): StoryControl | null | undefined => {
  if (typeof smartControls === 'object') {
    const { include, exclude } = smartControls;
    if (Array.isArray(include) && !include.includes(propDef.name)) {
      return null;
    }
    if (Array.isArray(exclude) && exclude.includes(propDef.name)) {
      return null;
    }
  }
  if (!propDef) {
    return null;
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
        type: isColor ? ControlTypes.COLOR : ControlTypes.TEXT,
        value,
      };
    }
    case 'bool': {
      let value;
      if (propDef.defaultValue) {
        if (propDef.defaultValue.summary === 'false') {
          value = false;
        }
        if (propDef.defaultValue.summary === 'true') {
          value = true;
        }
      }
      return { type: ControlTypes.BOOLEAN, value };
    }
    case 'number': {
      let value;
      try {
        value = propDef.defaultValue ? parseFloat(propDef.defaultValue.summary) : undefined;
      } catch (e) {
        // eat exceptoin
      }
      return { type: ControlTypes.NUMBER, value };
    }
    case 'enum': {
      const value = propDef.defaultValue ? cleanQuotes(propDef.defaultValue.summary) : undefined;
      const options = Array.isArray(propDef.type) ? propDef.type : propDef.type.value;
      if (!Array.isArray(options)) {
        return null;
      }
      return {
        type: ControlTypes.OPTIONS,
        options: options.map((v: any) => cleanQuotes(v.value)),
        value,
      };
    }
    case 'func': {
      return {
        type: ControlTypes.BUTTON,
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
        type: ControlTypes.OBJECT,
        maxRows: 10,
        value,
      };
    }
    default:
      return null;
  }
};

export const extractSmartProperties = (
  storyId: string,
  parameters: Parameters
): StoryControls | null => {
  const params = parameters || {};
  const { component, framework = null, controls } = params;
  const { smart: smartControls } = controls || {};
  if (!smartControls) {
    return null;
  }
  if (!component) {
    return null;
  }
  // check if mdx has parameters from mdx-compiler
  const mdxStoryHasParameters = params && params.mdxParams && params.mdxParams.length > 0;
  // check if story has parameters from source-loader
  const storyHasParameters =
    params &&
    params.storySource &&
    params.storySource.locationsMap &&
    params.storySource.locationsMap[storyId] &&
    params.storySource.locationsMap[storyId].params &&
    params.storySource.locationsMap[storyId].params.length > 0;
  if (!mdxStoryHasParameters && !storyHasParameters) {
    return null;
  }
  const { extractProps = inferPropsExtractor(framework) }: { extractProps: any } =
    params.docs || {};
  if (!extractProps) {
    return null;
  }
  const props = extractProps(component);
  const rows = getInputRows(props);
  const smartProps = rows
    ? rows.reduce((acc: StoryControls, row: PropDef) => {
        const field = createFieldFromProps(row, smartControls);
        if (field) {
          return { ...acc, [row.name]: field };
        }
        return acc;
      }, {})
    : null;
  return smartProps;
};
