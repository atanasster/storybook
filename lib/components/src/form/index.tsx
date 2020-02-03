import { styled } from '@storybook/theming';
import { Field } from './field/field';
// InputStyleProps import is for TS
import { InputStyleProps, Input, Select, Textarea, Button } from './input/input';
import { Toggle } from './toggle/Toggle';

export const Form = Object.assign(
  styled.form({
    boxSizing: 'border-box',
    width: '100%',
  }),
  {
    Field,
    Input,
    Select,
    Textarea,
    Button,
    Toggle,
  }
);
