import React, { ChangeEvent } from 'react';
import { styled } from '@storybook/theming';
import { StoryControlOptions } from '@storybook/common';
import { normalizeOptions, NormalizedOption } from './utils';
import { PropertyControlProps, PropertyEditor } from '../types';

interface CheckboxEditorProps extends PropertyControlProps {
  prop: StoryControlOptions;
}

const CheckboxesWrapper = styled.div<{ isInline: boolean }>(({ isInline }) =>
  isInline
    ? {
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        '> * + *': {
          marginLeft: 10,
        },
      }
    : {}
);

const CheckboxFieldset = styled.fieldset({
  border: 0,
  padding: 0,
  margin: 0,
});

const CheckboxLabel = styled.label({
  padding: '3px 0 3px 5px',
  lineHeight: '18px',
  display: 'inline-block',
});

export const CheckboxEditor: PropertyEditor<CheckboxEditorProps> = ({ prop, name, onChange }) => {
  const { options, value } = prop;
  const { entries, selected } = normalizeOptions(options, value);
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const currentValue = (e.target as HTMLInputElement).value;
    const values = entries
      .filter(entry => {
        const entryValue =
          typeof entry.value.toString === 'function' ? entry.value.toString() : entry.value;
        return selected.includes(entry.value)
          ? currentValue !== entryValue
          : currentValue === entryValue;
      })
      .map(entry => entry.value);
    onChange(name, values);
  };

  const renderCheckboxList = () => {
    return entries.map(entry => renderCheckbox(entry));
  };

  const renderCheckbox = (entry: NormalizedOption) => {
    const id = `${entry.label}-${entry.value}`;
    return (
      <div key={id}>
        <input
          type="checkbox"
          id={id}
          name={entry.label}
          value={entry.value}
          onChange={handleChange}
          checked={selected.includes(entry.value)}
        />
        <CheckboxLabel htmlFor={id}>{entry.label}</CheckboxLabel>
      </div>
    );
  };
  const isInline = prop.display === 'inline-check';
  return (
    <CheckboxFieldset>
      <CheckboxesWrapper isInline={isInline}>{renderCheckboxList()}</CheckboxesWrapper>
    </CheckboxFieldset>
  );
};
