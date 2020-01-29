import { PropDef } from '@storybook/components';
import { PropsExtractor } from '../lib/docgen/types';
import { extractProps as reactExtractProps } from '../frameworks/react/extractProps';
import { extractProps as vueExtractProps } from '../frameworks/vue/extractProps';

// FIXME: remove in SB6.0 & require config
export const inferPropsExtractor = (framework: string): PropsExtractor | null => {
  switch (framework) {
    case 'react':
      return reactExtractProps;
    case 'vue':
      return vueExtractProps;
    default:
      return null;
  }
};

export const filterRows = (rows: PropDef[], exclude: string[]) =>
  rows && rows.filter((row: PropDef) => !exclude.includes(row.name));
