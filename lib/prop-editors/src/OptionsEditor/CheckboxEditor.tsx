import React, { ChangeEvent } from 'react';
import { styled } from '@storybook/theming';
import { StoryPropertyOptions } from '@storybook/api';
import { PropertyControlProps, PropertyEditor } from '../types';

interface CheckboxEditorProps extends PropertyControlProps {
  prop: StoryPropertyOptions;
  isInline: boolean;
}

const CheckboxesWrapper = styled.div<Pick<CheckboxEditorProps, 'isInline'>>(({ isInline }) =>
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

export const CheckboxEditor: PropertyEditor<CheckboxEditorProps> = ({
  prop,
  name,
  onChange,
  isInline = false,
}) => {
  const [values, setValues] = React.useState<string[]>((prop.value as string[]) || []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const currentValue = (e.target as HTMLInputElement).value;

    if (values.includes(currentValue)) {
      values.splice(values.indexOf(currentValue), 1);
    } else {
      values.push(currentValue);
    }

    setValues(values);
    onChange(name, values);
  };

  const renderCheckboxList = () => {
    const { options } = prop;
    return Object.keys(options).map(key =>
      renderCheckbox(key, (options as { [key: string]: string })[key])
    );
  };

  const renderCheckbox = (label: string, value: string) => {
    const id = `${name}-${value}`;
    return (
      <div key={id}>
        <input
          type="checkbox"
          id={id}
          name={name}
          value={value}
          onChange={handleChange}
          checked={values.includes(value)}
        />
        <CheckboxLabel htmlFor={id}>{label}</CheckboxLabel>
      </div>
    );
  };
  return (
    <CheckboxFieldset>
      <CheckboxesWrapper isInline={isInline}>{renderCheckboxList()}</CheckboxesWrapper>
    </CheckboxFieldset>
  );
};
