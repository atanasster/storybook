import { PropDef, PropsTableRowsProps, PropsTableSectionsProps } from '@storybook/components';
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

export const getInputRows = (props: any): PropDef[] => {
  const { rows } = props as PropsTableRowsProps;
  if (rows) {
    return rows;
  }
  const { sections } = props as PropsTableSectionsProps;
  if (sections) {
    const results: PropDef[] = [];
    Object.keys(sections).forEach(key => {
      const fields = sections[key];
      fields.forEach(field => {
        if (field.isInput) {
          results.push(field);
        }
      });
    });
    return results;
  }
  return null;
};
