import { action } from '@storybook/addon-actions';

export default {
  title: 'Addon/Controls',
};

export const Simple = ({ name, age }) => {
  const content = `I am ${name} and I'm ${age} years old.`;

  return {
    tags: [`<div>${content}</div>`],
  };
};

Simple.story = {
  controls: {
    name: { type: 'text', label: 'Name', value: 'John Doe' },
    age: { type: 'number', label: 'Age', value: 44 },
  },
};

export const AllControls = ({ name, stock, fruit, price, colour, today, items, nice }) => {
  const stockMessage = stock
    ? `I have a stock of ${stock} ${fruit}, costing &dollar;${price} each.`
    : `I'm out of ${fruit}${nice ? ', Sorry!' : '.'}`;
  const salutation = nice ? 'Nice to meet you!' : 'Leave me alone!';
  const dateOptions = { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' };

  return {
    tags: [
      `
          <WhatIGot><div style="border:2px dotted ${colour}; padding: 8px 22px; border-radius: 8px">
            <h1>My name is ${name},</h1>
            <h3>today is ${new Date(today).toLocaleDateString('en-US', dateOptions)}</h3>
            <p>${stockMessage}</p>
            <p>Also, I have:</p>
            <ul>
              ${items.map(item => `<li key="${item}">${item}</li>`).join('')}
            </ul>
            <p>${salutation}</p>
          </div></WhatIGot>
        `,
    ],
  };
};

AllControls.story = {
  name: 'All controls',
  controls: {
    name: { type: 'text', label: 'Name', value: 'Jane' },
    stock: { type: 'number', label: 'Stock', value: 20, range: true, min: 0, max: 30, stpe: 5 },
    button: { type: 'button', label: 'Arbitrary action', onClick: action('You clicked it!') },
    fruit: {
      type: 'options',
      label: 'Fruit',
      options: {
        Apple: 'apples',
        Banana: 'bananas',
        Cherry: 'cherries',
      },
      value: 'apples',
    },
    price: { type: 'number', label: 'Price', value: 2.25 },
    colour: { type: 'color', label: 'Border', value: 'deeppink' },
    today: { type: 'date', label: 'Today', value: new Date('Jan 20 2017 GMT+0') },
    items: { type: 'array', label: 'Items', value: ['Laptop', 'Book', 'Whiskey'] },
    nice: { type: 'boolean', abel: 'Nice', value: true },
  },
};

export const XssSafety = ({ content }) => ({
  tags: [
    `
      <div>
        ${content}
      </div>
    `,
  ],
});

XssSafety.story = {
  name: 'XSS safety',
  controls: {
    content: {
      type: 'text',
      value: '<img src=x onerror="alert(\'XSS Attack\')" >',
      escapeValue: true,
    },
  },
};
