import { action } from '@storybook/addon-actions';

import { SimpleKnobsComponent } from './knobs.component';
import { AllKnobsComponent } from './all-knobs.component';

export default {
  title: 'Addon/Controls',
};

export const Simple = ({ name, age, phoneNumber }) => {
  return {
    moduleMetadata: {
      entryComponents: [SimpleKnobsComponent],
      declarations: [SimpleKnobsComponent],
    },
    template: `
        <h1> This is a template </h1>
        <storybook-simple-knobs-component
          [age]="age"
          [phoneNumber]="phoneNumber"
          [name]="name"
        >
        </storybook-simple-knobs-component>
      `,
    props: {
      name,
      age,
      phoneNumber,
    },
  };
};

Simple.story = {
  name: 'Simple',
  controls: {
    name: { type: 'text', value: 'John Doe' },
    age: { type: 'number', value: 8 },
    phoneNumber: { type: 'text', value: '555-55-55' },
  },
};

export const AllControls = ({
  name,
  stock,
  fruit,
  otherFruit,
  price,
  border,
  today,
  items,
  nice,
}) => {
  return {
    component: AllKnobsComponent,
    props: {
      name,
      stock,
      fruit,
      otherFruit,
      price,
      border,
      today,
      items,
      nice,
    },
  };
};

AllControls.story = {
  name: 'All controls',
  controls: {
    name: { type: 'text', value: 'Jane' },
    stock: { type: 'number', value: 20, range: true, min: 0, max: 30, step: 5 },
    fruit: {
      type: 'options',
      options: {
        Apple: 'apples',
        Banana: 'bananas',
        Cherry: 'cherries',
      },
      value: 'apples',
    },
    otherFruit: {
      type: 'options',
      display: 'radios',
      label: 'Other Fruit',
      options: {
        Kiwi: 'kiwi',
        Guava: 'guava',
        Watermelon: 'watermelon',
      },
      value: 'watermelon',
    },
    price: { type: 'number', value: 2.25 },

    border: { type: 'color', value: 'deeppink' },
    today: { type: 'date', value: new Date('Jan 20 2017') },
    items: { type: 'array', items: ['Laptop', 'Book', 'Whiskey'] },
    nice: { type: 'boolean', value: true },
    button: { type: 'button', label: 'Arbitrary action', value: action('You clicked it!') },
  },
};

export const XssSafety = ({ text }) => ({
  template: text,
});

XssSafety.story = {
  name: 'XSS safety',
  controls: {
    text: {
      type: 'text',
      label: 'Rendered string',
      value: '<img src=x onerror="alert(\'XSS Attack\')" >',
    },
  },
};
