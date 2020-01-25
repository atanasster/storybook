import React from 'react';
import { styled } from '@storybook/theming';
import { StoryPropertyOptions, OptionsValueType } from '@storybook/api';
import { PropertyControlProps, PropertyEditor } from '../types';

interface RadiosEditorProps extends PropertyControlProps {
  prop: StoryPropertyOptions;
  isInline: boolean;
}

const RadiosWrapper = styled.div<Pick<RadiosEditorProps, 'isInline'>>(({ isInline }) =>
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

const RadioLabel = styled.label({
  padding: '3px 0 3px 5px',
  lineHeight: '18px',
  display: 'inline-block',
});

export const RadiosEditor: PropertyEditor<RadiosEditorProps> = ({
  prop,
  name,
  onChange,
  isInline = false,
}) => {
  const renderRadioButton = (label: string, value: OptionsValueType) => {
    const opts = { label, value };
    const id = `${name}-${opts.value}`;

    return (
      <div key={id}>
        <input
          type="radio"
          id={id}
          name={name}
          value={(opts.value as string | string[] | number) || undefined}
          onChange={e => onChange(name, e.target.value)}
          checked={value === prop.value}
        />
        <RadioLabel htmlFor={id}>{label}</RadioLabel>
      </div>
    );
  };
  const renderRadioButtonList = () => {
    const { options } = prop;
    if (Array.isArray(options)) {
      return (options as OptionsValueType[]).map(val => renderRadioButton(val as string, val));
    }
    return Object.keys(options).map(key => renderRadioButton(key, options[key]));
  };

  return <RadiosWrapper isInline={isInline}>{renderRadioButtonList()}</RadiosWrapper>;
};
