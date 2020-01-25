import React from 'react';
import ReactSelect from 'react-select';
import { styled } from '@storybook/theming';
import { StoryPropertyOptions, OptionsValueType } from '@storybook/api';
import { PropertyControlProps, PropertyEditor } from '../types';

import { RadiosEditor } from './RadiosEditor';
import { CheckboxEditor } from './CheckboxEditor';

const OptionsSelect = styled(ReactSelect)({
  width: '100%',
  maxWidth: '300px',
  color: 'black',
});

type ReactSelectOnChangeFn =
  | { (v: OptionsSelectValueItem): void }
  | { (v: OptionsSelectValueItem[]): void };

interface OptionsSelectValueItem {
  value: any;
  label: string;
}

interface OptionsEditorProps extends PropertyControlProps {
  prop: StoryPropertyOptions;
}

export const OptionsEditor: PropertyEditor<OptionsEditorProps> = props => {
  const { prop, name, onChange } = props;
  const { display, options, value } = prop;
  console.log(options, value);
  const findLabelOption = (option: any, label: any, i: number) => {
    if (typeof option !== 'object' || option === null) return { label: label || option, option };
    const vLabel: string = option.label || option.key || JSON.stringify(label) || i;
    return {
      label: vLabel,
      option,
    };
  };

  let entries: { [key: string]: OptionsValueType } | undefined;
  if (Array.isArray(options)) {
    entries = (options as OptionsValueType[]).reduce((acc: object, o, i) => {
      const { label, option } = findLabelOption(o, null, i);
      return { ...acc, [option]: label };
    }, {});
  } else {
    entries = Object.keys(options).reduce((acc, key, i) => {
      const { label, option } = findLabelOption(key, options[key], i);
      return { ...acc, [option]: label };
    }, {});
  }

  const selectedKey = Object.keys(entries).filter(key => {
    if (Array.isArray(value)) {
      return value.includes(key);
    }
    return key === value;
  });

  const rProps = { ...props, options: entries, value: selectedKey };
  if (display === 'check' || display === 'inline-check') {
    const isInline = display === 'inline-check';
    return <CheckboxEditor {...rProps} isInline={isInline} />;
  }

  if (display === 'radio' || display === 'inline-radio') {
    const isInline = display === 'inline-radio';
    return <RadiosEditor {...rProps} isInline={isInline} />;
  }

  if (display === undefined || display === 'select' || display === 'multi-select') {
    const isMulti = display === 'multi-select';
    let handleChange: ReactSelectOnChangeFn = (e: OptionsSelectValueItem) =>
      onChange(name, e.value);

    if (isMulti) {
      handleChange = (values: OptionsSelectValueItem[]) =>
        onChange(
          name,
          values.map(item => item.value)
        );
    }
    const selectOptions = Object.keys(entries).map(key => ({ label: entries[key], value: key }));
    const selectValue = selectOptions.filter(op => selectedKey.includes(op.value));
    console.log(selectValue, selectedKey);
    return (
      <OptionsSelect
        value={selectValue}
        options={selectOptions}
        isMulti={isMulti}
        onChange={handleChange}
      />
    );
  }

  return null;
};
