import { OptionsListType, OptionsValueType } from '@storybook/api';

export interface NormalizedOption {
  label: string;
  value: any;
}
export type NormalizedOptions = NormalizedOption[];

export const normalizeOptions = (
  options: OptionsListType,
  propValue: OptionsValueType
): {
  entries: NormalizedOptions;
  selected: any[];
} => {
  const findLabelOption = (label: string, value: any): NormalizedOption => {
    const val = value.value || value;
    if (typeof value !== 'object' || value === null) return { label: label || val, value: val };
    const vLabel: string = value.label || val || label;
    return {
      label: vLabel,
      value: val,
    };
  };

  let entries: NormalizedOptions;
  if (Array.isArray(options)) {
    entries = options.reduce((acc: NormalizedOptions, o) => {
      return [...acc, findLabelOption(null, o)];
    }, []);
  } else {
    entries = Object.keys(options).reduce((acc, key) => {
      return [...acc, findLabelOption(options[key], key)];
    }, []);
  }
  const selected = entries
    .filter(option => {
      if (Array.isArray(propValue)) {
        return propValue.findIndex((v: any) => v === option.value) >= 0;
      }
      return option.value === propValue;
    })
    .map(e => e.value);
  return { selected, entries };
};
