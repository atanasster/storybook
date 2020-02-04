/* eslint-disable react/prop-types */
import { createElement } from 'rax';

import Text from 'rax-text';

export default {
  title: 'Addon/addon-controls',
};

export const WithAButton = ({ disabled, hasStyle, name }) => {
  const style = hasStyle
    ? {
        border: '1px solid #d2d2d2',
        width: 200,
        paddingLeft: 10,
        paddingRight: 10,
      }
    : null;
  const textStyle = hasStyle
    ? {
        color: disabled ? '#666' : '#00f',
        fontSize: 16,
      }
    : {
        color: disabled ? '#666' : '#000',
      };
  return (
    <button style={style} disabled={disabled} type="button">
      <Text style={textStyle}>{name}</Text>
    </button>
  );
};

WithAButton.story = {
  name: 'with a button',
  controls: {
    name: { type: 'text', label: 'Label', value: 'Hello Storybook' },
    disabled: { type: 'boolean', label: 'Disabled', value: false },
    hasStyle: { type: 'boolean', label: 'Has Style', value: false },
  },
};

export const AsDynamicVariables = ({ name, age }) => {
  const content = `I am ${name} and I'm ${age} years old.`;
  return <Text>{content}</Text>;
};

AsDynamicVariables.story = {
  name: 'as dynamic variables',
  controls: {
    name: { type: 'text', label: 'Name', value: 'John Doe' },
    age: { type: 'number', label: 'Age', value: 44 },
  },
};
