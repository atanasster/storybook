import React from 'react';
import { Toggle } from './Toggle';
import { Icons } from '../../icon/icon';
import { Form } from '../index';

const { Toggle: FormToggle } = Form;

export default {
  title: 'Basics/Toggle',
};

export const allToggles = () => {
  const [checked, setChecked] = React.useState(false);
  return (
    <div>
      <p>Default toggle</p>
      <Toggle checked={checked} onChange={check => setChecked(check)} />
      <br />
      <p>Toggle on a Form</p>
      <FormToggle checked={checked} onChange={check => setChecked(check)} />
      <br />
      <p>Custom labels</p>
      <Toggle
        checked={checked}
        labels={{
          true: 'YES',
          false: 'NO!',
        }}
        onChange={check => setChecked(check)}
      />
      <br />
      <p>Custom icon labels</p>
      <Toggle
        checked={checked}
        labels={{
          true: <Icons icon="check" />,
          false: <Icons icon="delete" />,
        }}
        onChange={check => setChecked(check)}
      />
      <br />
    </div>
  );
};
